// CommonJS
const jwt = require('jsonwebtoken')

/**
 * auth(options)
 * - options.optional: si true, no devuelve 401 cuando falta token; deja req.user = null
 * - options.requiredRole: string | string[] con el/los roles permitidos
 *
 * Usos:
 *  router.get('/me', auth(), controller)                       // requiere login
 *  router.get('/public', auth({ optional: true }), controller) // login opcional
 *  router.get('/admin', auth({ requiredRole: 'admin' }), ctrl) // requiere rol
 *  router.get('/staff', auth({ requiredRole: ['admin','staff'] }), ctrl)
 *
 * Compatibilidad: también acepta auth('admin') como alias de { requiredRole:'admin' }
 */
module.exports = function auth(options = {}) {
  // Soporta llamada abreviada auth('admin')
  const normalized = typeof options === 'string'
    ? { requiredRole: options }
    : options

  const { optional = false, requiredRole = null } = normalized

  return function authMiddleware(req, res, next) {
    try {
      // 1) Obtener token desde cookie o header
      const bearer = req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null

      const token = (req.cookies && req.cookies.token) || bearer

      if (!token) {
        if (optional) {
          req.user = null
          return next()
        }
        return res.status(401).json({ error: 'No token' })
      }

      // 2) Verificar y normalizar payload
      const payload = jwt.verify(token, process.env.JWT_SECRET)

      const id = payload.sub || payload.id || payload._id
      const role = payload.role

      if (!id) {
        // payload inválido aunque verificado (no trae id)
        return res.status(401).json({ error: 'Invalid token payload' })
      }

      req.user = { id, role, ...payload }

      // 3) Chequear rol si se exige
      if (requiredRole) {
        const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
        const allowed = role && required.includes(role)
        if (!allowed) {
          return res.status(403).json({ error: 'Forbidden: insufficient role' })
        }
      }

      // 4) Adelante
      return next()
    } catch (e) {
      // Token inválido/expirado
      if (optional) {
        req.user = null
        return next()
      }
      return res.status(401).json({ error: 'Invalid token' })
    }
  }
}
