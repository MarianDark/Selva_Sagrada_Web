// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/auth');

module.exports = function auth(options = {}) {
  const normalized = typeof options === 'string' ? { requiredRole: options } : options;
  const { optional = false, requiredRole = null } = normalized;
  const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'sid';
  const JWT_SECRET = getJwtSecret();

  return function authMiddleware(req, res, next) {
    try {
      let token = null;
      const authz = req.headers.authorization;
      if (authz && authz.startsWith('Bearer ')) token = authz.slice(7).trim();
      if (!token && req.cookies) token = req.cookies[COOKIE_NAME] || req.cookies.token || null;

      if (!token) {
        if (optional) { req.user = null; return next(); }
        return res.status(401).json({ message: 'No autorizado: falta token' });
      }

      const payload = jwt.verify(token, JWT_SECRET);
      const id = payload.sub || payload.id || payload._id;
      const role = payload.role;
      if (!id) return res.status(401).json({ message: 'Token inválido: sin identificador' });

      req.user = { id, role, ...payload };

      if (requiredRole) {
        const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const userRole = String(role || '').toLowerCase();
        const allowed = required.some((r) => String(r).toLowerCase() === userRole);
        if (!allowed) return res.status(403).json({ message: 'Prohibido: rol insuficiente' });
      }

      return next();
    } catch (_) {
      if (optional) { req.user = null; return next(); }
      return res.status(401).json({ message: 'Token inválido' });
    }
  };
};
