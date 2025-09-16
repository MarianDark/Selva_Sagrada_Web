const { URLSearchParams } = require('url')

// Node 18+: fetch global
async function verifyRecaptcha(token, remoteIp) {
  const secret = process.env.RECAPTCHA_SECRET
  if (!secret) throw new Error('RECAPTCHA_SECRET missing')
  if (!token) return { ok: false, data: { 'error-codes': ['missing-input-response'] } }

  const params = new URLSearchParams()
  params.append('secret', secret)
  params.append('response', token)
  if (remoteIp) params.append('remoteip', remoteIp)

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  })
  const data = await res.json()
  return { ok: !!data.success, data }
}

module.exports = function captcha(options = {}) {
  const {
    enforceScore = false,
    minScore = 0.5,
    expectedAction,
    expectedHostname,
  } = options

  const required = process.env.NODE_ENV === 'production' && process.env.RECAPTCHA_BYPASS !== '1'

  return async function captchaMiddleware(req, res, next) {
    try {
      if (!required) return next()

      const token = req.body?.captchaToken
      if (!token) return res.status(400).json({ message: 'Captcha requerido' })

      const remoteIp = req.ip || req.headers['x-forwarded-for']
      const { ok, data } = await verifyRecaptcha(token, remoteIp)
      if (!ok) return res.status(400).json({ message: 'Captcha inválido' })

      if (expectedHostname && data.hostname && data.hostname !== expectedHostname) {
        return res.status(400).json({ message: 'Captcha inválido (hostname)' })
      }
      if (expectedAction && data.action && data.action !== expectedAction) {
        return res.status(400).json({ message: 'Captcha inválido (acción)' })
      }
      if (enforceScore && typeof data.score === 'number' && data.score < minScore) {
        return res.status(400).json({ message: 'Captcha inválido (score bajo)' })
      }

      next()
    } catch (e) {
      console.error('[reCAPTCHA] error', e)
      res.status(502).json({ message: 'Captcha servicio no disponible' })
    }
  }
}
