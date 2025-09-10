const router = require('express').Router();
const auth = require('../middleware/auth');
const captcha = require('../middleware/captcha');
const C = require('../controllers/bookings.controller');

// Crear reserva (usuario logueado + captcha)
router.post('/', auth(), captcha, C.create);

// Mis reservas
router.get('/mine', auth(), C.mine);

// Listado completo (admin)
router.get('/', auth('admin'), C.all);

// Cancelar
router.delete('/:id', auth(), C.cancel);

module.exports = router;
