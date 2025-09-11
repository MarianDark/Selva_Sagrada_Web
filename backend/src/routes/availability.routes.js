const router = require('express').Router();
const auth = require('../middleware/auth');
const C = require('../controllers/availability.controller');

// Obtener disponibilidad (público)
router.get('/', C.getAvailability);

// Crear o actualizar disponibilidad (solo admin)
router.post('/', auth('admin'), C.setAvailability);

// Eliminar disponibilidad de un día (solo admin)
router.delete('/:id', auth('admin'), C.deleteAvailability);

module.exports = router;
