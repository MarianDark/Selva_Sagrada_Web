const jwt = require('jsonwebtoken')

module.exports = function requireAuth(req, res, next) {
  try {
    const bearer = req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null

    const token = (req.cookies && req.cookies.token) || bearer
    if (!token) {
      return res.status(401).json({ error: 'No token' })
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.sub || payload.id, ...payload }
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
