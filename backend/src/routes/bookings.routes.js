const router = require('express').Router();
const auth = require('../middleware/auth');
const captcha = require('../middleware/captcha');
const C = require('../controllers/bookings.controller');


router.post('/', auth(), captcha, C.create);
router.get('/me', auth(), C.mine);
router.get('/', auth('admin'), C.all);


module.exports = router;