const router = require('express').Router()
const auth = require('../middleware/auth')
const C = require('../controllers/contact.controller')

// Crear mensaje (SIN captcha)
router.post('/', ...C.create)

// Listar mensajes (solo admin)
router.get('/', auth('admin'), C.list)

module.exports = router
