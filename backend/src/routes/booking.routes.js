const router = require('express').Router();
const auth = require('../middleware/auth');
const captcha = require('../middleware/captcha');
const C = require('../controllers/booking.controller');

// Crear reserva (público con captcha; si hay sesión se guarda userId)
router.post('/', captcha, C.create);

// Mis reservas (requiere login)
router.get('/me', auth(), C.mine);

// Todas las reservas (admin)
router.get('/', auth('admin'), C.all);

// Cancelar (dueño o admin)
router.patch('/:id/cancel', auth(), C.cancel);

module.exports = router;
