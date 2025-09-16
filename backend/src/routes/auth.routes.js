const router = require('express').Router()
const captcha = require('../middleware/captcha') // fábrica -> se usa captcha()
const auth = require('../middleware/auth')
const C = require('../controllers/auth.controller')

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

// 🔓 Registro SIN captcha
router.post('/register', asyncHandler(C.register))

// Verificación email
router.get('/verify-email',  asyncHandler(C.verifyEmail))
router.post('/verify-email', asyncHandler(C.verifyEmail))

// 🔐 Login CON captcha (único lugar con captcha)
router.post('/login', captcha(), asyncHandler(C.login))

router.post('/logout', asyncHandler(C.logout))

// Usuario actual
router.get('/me', auth(), asyncHandler(C.me))

// Recuperación de contraseña (SIN captcha)
router.post('/forgot-password', asyncHandler(C.forgotPassword))
router.post('/reset-password',  asyncHandler(C.resetPassword))

module.exports = router
