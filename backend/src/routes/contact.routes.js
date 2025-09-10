const router = require('express').Router()
const captcha = require('../middleware/captcha')
const auth = require('../middleware/auth')
const C = require('../controllers/contact.controller')

// Crear mensaje (público con captcha)
router.post('/', captcha, C.create)

// Listar mensajes (solo admin)
router.get('/', auth('admin'), C.list)

module.exports = router
