// backend/src/middleware/auth.js
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

  // Nombre de cookie configurable (por defecto 'sid'); compatibilidad con 'token'
  const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'sid'

  return function authMiddleware(req, res, next) {
    try {
      // 1) Obtener token desde Authorization: Bearer, cookie[SESSION_COOKIE_NAME] o cookie['token'] legacy
      let token = null

      const authz = req.headers.authorization
      if (authz && authz.startsWith('Bearer ')) {
        token = authz.slice(7).trim()
      }

      if (!token && req.cookies) {
        token = req.cookies[COOKIE_NAME] || req.cookies.token || null
      }

      if (!token) {
        if (optional) {
          req.user = null
          return next()
        }
        return res.status(401).json({ message: 'No autorizado: falta token' })
      }

      // 2) Verificar y normalizar payload
      const payload = jwt.verify(token, process.env.JWT_SECRET)

      const id = payload.sub || payload.id || payload._id
      const role = payload.role

      if (!id) {
        return res.status(401).json({ message: 'Token inválido: sin identificador' })
      }

      req.user = { id, role, ...payload }

      // 3) Chequear rol si se exige
      if (requiredRole) {
        const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
        const userRole = String(role || '').toLowerCase()
        const allowed = required.some(r => String(r).toLowerCase() === userRole)
        if (!allowed) {
          return res.status(403).json({ message: 'Prohibido: rol insuficiente' })
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
      return res.status(401).json({ message: 'Token inválido' })
    }
  }
}
