const router = require('express').Router()
const auth = require('../middleware/auth')
const C = require('../controllers/booking.controller')

// Crear reserva — SOLO usuarios logueados (SIN captcha)
router.post('/', auth(), ...C.create)

// Mis reservas
router.get('/me', auth(), C.mine)

// Todas (admin)
router.get('/', auth('admin'), C.all)

// Cancelar
router.patch('/:id/cancel', auth(), C.cancel)

module.exports = router
