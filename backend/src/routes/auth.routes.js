const router = require('express').Router()
const validate = require('../middleware/validate')
const captcha = require('../middleware/captcha')
const auth = require('../middleware/auth')
const C = require('../controllers/auth.controller')

// Registro / verificación / login / logout
router.post('/register', C.register, validate)
router.post('/verify-email', C.verifyEmail)
router.post('/login', captcha, C.login)
router.post('/logout', C.logout)

// Usuario actual
router.get('/me', auth(), C.me)

// Recuperación de contraseña
router.post('/forgot-password', captcha, C.forgotPassword) // envía email con token
router.post('/reset-password', C.resetPassword, validate) // aplica nueva contraseña

module.exports = router
