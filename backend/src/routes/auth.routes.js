const router = require('express').Router()
const captcha = require('../middleware/captcha')
const auth = require('../middleware/auth')
const C = require('../controllers/auth.controller')

// Simple wrapper para capturar errores de controladores async
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

// Registro / verificación / login / logout
router.post('/register', captcha(), asyncHandler(C.register))

// Verificación email (GET con token en query, POST con token en body)
router.get('/verify-email', asyncHandler(C.verifyEmail))
router.post('/verify-email', asyncHandler(C.verifyEmail))

// Login protegido por captcha
router.post('/login', captcha(), asyncHandler(C.login))

router.post('/logout', asyncHandler(C.logout))

// Usuario actual (requiere auth: cookie httpOnly o Bearer)
router.get('/me', auth(), asyncHandler(C.me))

// Recuperación de contraseña
router.post('/forgot-password', captcha(), asyncHandler(C.forgotPassword))
router.post('/reset-password', asyncHandler(C.resetPassword))

module.exports = router
