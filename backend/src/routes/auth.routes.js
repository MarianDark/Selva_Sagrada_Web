const router = require('express').Router();
const validate = require('../middleware/validate');
const captcha = require('../middleware/captcha');
const auth = require('../middleware/auth');
const C = require('../controllers/auth.controller');

router.post('/register', validate, C.register);
router.post('/verify-email', C.verifyEmail);
router.post('/login', captcha, C.login);
router.post('/logout', C.logout);
router.get('/me', auth(), C.me);
router.post('/forgot-password', captcha, C.forgotPassword);
router.post('/reset-password', validate, C.resetPassword);

module.exports = router;
