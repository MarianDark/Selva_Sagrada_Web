const router = require('express').Router();
const captcha = require('../middleware/captcha');
const auth = require('../middleware/auth');
const C = require('../controllers/auth.controller');

// Registro / verificación / login / logout
router.post('/register', C.register);
router.get('/verify-email', C.verifyEmail);    // <-- NUEVO (GET con token en query)
router.post('/verify-email', C.verifyEmail);   // <-- mantiene el POST existente
router.post('/login', captcha, C.login);
router.post('/logout', C.logout);

// Usuario actual
router.get('/me', auth(), C.me);

// Recuperación de contraseña
router.post('/forgot-password', captcha, C.forgotPassword);
router.post('/reset-password', C.resetPassword);

module.exports = router;
