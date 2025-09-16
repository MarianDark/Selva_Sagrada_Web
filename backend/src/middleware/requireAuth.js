const jwt = require('jsonwebtoken')

module.exports = function requireAuth(req, res, next) {
  try {
    const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'sid'

    let token = null

    const authz = req.headers.authorization
    if (authz && authz.startsWith('Bearer ')) {
      token = authz.slice(7).trim()
    }

    if (!token && req.cookies) {
      token = req.cookies[COOKIE_NAME] || req.cookies.token || null
    }

    if (!token) {
      return res.status(401).json({ error: 'No token' })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.sub || payload.id || payload._id, ...payload }
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
