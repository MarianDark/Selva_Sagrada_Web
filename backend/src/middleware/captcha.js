const { URLSearchParams } = require('url')

// En Node 18+ fetch es global; si tu runtime es más viejo, usa node-fetch o axios.
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

/**
 * Middleware de reCAPTCHA (v2 invisible o v3)
 * - En producción exige token a menos que RECAPTCHA_BYPASS=1
 * - Acepta score de v3 si viene; en v2 no rompe
 * - Opcionalmente puedes fijar expectedAction / expectedHostname
 */
module.exports = function captcha(options = {}) {
  const {
    enforceScore = false,          // en v3 puedes exigir score; en v2 no hay score
    minScore = 0.5,                // umbral para v3
    expectedAction,                // solo v3
    expectedHostname               // opcional, valida hostname devuelto por Google
  } = options

  const required = process.env.NODE_ENV === 'production' && process.env.RECAPTCHA_BYPASS !== '1'

  return async function captchaMiddleware(req, res, next) {
    try {
      if (!required) return next()

      const token = req.body?.captchaToken
      if (!token) return res.status(400).json({ message: 'Captcha requerido' })

      // Si estás detrás de proxy (Render), asegúrate de tener app.set('trust proxy', 1)
      const remoteIp = req.ip || req.headers['x-forwarded-for']

      const { ok, data } = await verifyRecaptcha(token, remoteIp)
      if (!ok) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[reCAPTCHA] fallo', data)
        }
        return res.status(400).json({ message: 'Captcha inválido' })
      }

      // Validaciones opcionales (si Google devuelve estos campos)
      if (expectedHostname && data.hostname && data.hostname !== expectedHostname) {
        return res.status(400).json({ message: 'Captcha inválido (hostname)' })
      }
      if (expectedAction && data.action && data.action !== expectedAction) {
        return res.status(400).json({ message: 'Captcha inválido (acción)' })
      }
      if (enforceScore && typeof data.score === 'number' && data.score < minScore) {
        return res.status(400).json({ message: 'Captcha inválido (score bajo)' })
      }

      return next()
    } catch (e) {
      console.error('[reCAPTCHA] error', e)
      // No expongas el detalle exacto en prod
      return res.status(502).json({ message: 'Captcha servicio no disponible' })
    }
  }
}
