const Contact = require('../models/ContactMessage')
const { transporter } = require('../config/mailer')

// Crear un nuevo mensaje de contacto
exports.create = async (req, res, next) => {
  try {
    const { name, email, message } = req.body
    const doc = await Contact.create({ name, email, message, source: 'footer' })

    await transporter.sendMail({
      to: process.env.ADMIN_EMAIL,
      from: process.env.SMTP_FROM,
      subject: 'Nuevo mensaje de contacto',
      html: `<p><b>De:</b> ${name} (${email})</p><p>${message}</p>`,
    })

    res.status(201).json({ message: 'Mensaje enviado', id: doc._id })
  } catch (e) {
    next(e)
  }
}

// Listar todos los mensajes de contacto (admin)
exports.list = async (req, res, next) => {
  try {
    const docs = await Contact.find().sort({ createdAt: -1 }).lean()
    res.json(docs)
  } catch (e) {
    next(e)
  }
}
