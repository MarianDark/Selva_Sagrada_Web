const router = require('express').Router();
const auth = require('../middleware/auth');
const C = require('../controllers/booking.controller');

// Crear reserva — SOLO usuarios logueados
router.post('/', auth(), C.create);

// Mis reservas (requiere login)
router.get('/me', auth(), C.mine);

// Todas las reservas (admin)
router.get('/', auth('admin'), C.all);

// Cancelar (dueño o admin)
router.patch('/:id/cancel', auth(), C.cancel);

module.exports = router;
