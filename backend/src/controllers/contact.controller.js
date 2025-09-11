const { body } = require('express-validator');
const validate = require('../middleware/validate');
const Contact = require('../models/ContactMessage');
const { transporter } = require('../config/mailer');

exports.create = [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('message').isString().isLength({ min: 5 }),
  validate,
  async (req, res, next) => {
    try {
      const { name, email, message } = req.body;
      const doc = await Contact.create({ name, email, message, source: 'footer' });

      if (process.env.ADMIN_EMAIL) {
        try {
          await transporter.sendMail({
            to: process.env.ADMIN_EMAIL,
            from: process.env.SMTP_FROM,
            subject: 'Nuevo mensaje de contacto',
            html: `<p><b>De:</b> ${name} (${email})</p><p>${message}</p>`,
          });
        } catch (_) {}
      }

      res.status(201).json({ message: 'Mensaje enviado', id: doc._id });
    } catch (e) { next(e); }
  }
];

exports.list = async (req, res, next) => {
  try {
    const docs = await Contact.find().sort({ createdAt: -1 }).lean();
    res.json(docs);
  } catch (e) { next(e); }
};
