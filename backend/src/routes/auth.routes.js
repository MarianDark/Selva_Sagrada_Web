// src/routes/auth.routes.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const C = require('../controllers/auth.controller');

// Envoltorio async seguro para cualquier middleware/handler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Si te pasan un array de middlewares, los envolvemos uno a uno.
// Si es una función, la envolvemos y listo.
const wrap = (mw) => Array.isArray(mw) ? mw.map(asyncHandler) : [asyncHandler(mw)];

/* ========= Rutas Auth ========= */

// Registro (C.register es ARRAY de middlewares)
router.post('/register', ...wrap(C.register));

// Verificación de email (puede llegar por GET o POST)
router.get('/verify-email', ...wrap(C.verifyEmail));
router.post('/verify-email', ...wrap(C.verifyEmail));

// Login (C.login es FUNCIÓN)
// OJO: el controlador debe fijar la cookie httpOnly:
// res.cookie('token', jwtToken, { httpOnly: true, secure: process.env.NODE_ENV==='production', sameSite: 'lax', domain: '.ssselvasagrada.com', path: '/', maxAge: 1000*60*60*24*7 });
router.post('/login', ...wrap(C.login));

// Logout (si tu controlador no borra la cookie, añade aquí un fallback elegante)
router.post('/logout', ...wrap(async (req, res) => {
  // Si C.logout existe, lo usamos y terminamos
  if (typeof C.logout === 'function') return C.logout(req, res);

  // Fallback: borrar cookie y responder 204
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    domain: '.ssselvasagrada.com',
    path: '/',
  });
  return res.status(204).end();
}));

// Usuario actual (protegida)
router.get('/me', auth(), ...wrap(C.me));

// Recuperación de contraseña (función)
router.post('/forgot-password', ...wrap(C.forgotPassword));

// Reset password (ARRAY de middlewares)
router.post('/reset-password', ...wrap(C.resetPassword));

module.exports = router;
