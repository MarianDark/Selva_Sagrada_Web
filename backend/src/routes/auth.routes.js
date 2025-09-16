const router = require('express').Router()
const captcha = require('../middleware/captcha') // fábrica -> se usa captcha()
const auth = require('../middleware/auth')
const C = require('../controllers/auth.controller')

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

// 🔓 Registro SIN captcha — C.register es un ARRAY de middlewares → usa spread
router.post('/register', ...C.register)

// Verificación email — estas sí son FUNCIONES
router.get('/verify-email',  asyncHandler(C.verifyEmail))
router.post('/verify-email', asyncHandler(C.verifyEmail))

// 🔐 Login CON captcha — C.login es una FUNCIÓN
router.post('/login', captcha(), asyncHandler(C.login))

router.post('/logout', asyncHandler(C.logout))

// Usuario actual
router.get('/me', auth(), asyncHandler(C.me))

// Recuperación de contraseña
router.post('/forgot-password', asyncHandler(C.forgotPassword))

// ⛏️ Reset password — C.resetPassword es ARRAY → usa spread
router.post('/reset-password', ...C.resetPassword)

module.exports = router
