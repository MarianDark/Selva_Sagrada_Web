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

      // Guardar en DB
      const doc = await Contact.create({ name, email, message, source: 'footer' });

      // Notificación al admin
      if (process.env.ADMIN_EMAIL) {
        try {
          await transporter.sendMail({
            to: process.env.ADMIN_EMAIL,
            from: process.env.SMTP_FROM,
            subject: 'Nuevo mensaje de contacto',
            html: `
              <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
                <p><b>De:</b> ${name} (${email})</p>
                <p style="white-space:pre-wrap">${message}</p>
                <p><b>ID:</b> ${doc._id}</p>
              </div>
            `,
          });
        } catch (_) {}
      }

      // Autoresponder (opcional)
      try {
        await transporter.sendMail({
          to: email,
          from: process.env.SMTP_FROM,
          subject: 'Hemos recibido tu mensaje – Selva Sagrada',
          html: `
            <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
              <p>Hola ${name},</p>
              <p>Gracias por escribirnos. Hemos recibido tu mensaje y te responderemos lo antes posible.</p>
              <hr />
              <p style="opacity:.8"><b>Tu mensaje:</b></p>
              <p style="white-space:pre-wrap;opacity:.8">${message}</p>
            </div>
          `,
        });
      } catch (_) {}

      res.status(201).json({ message: 'Mensaje enviado', id: doc._id });
    } catch (e) {
      next(e);
    }
  }
];

exports.list = async (req, res, next) => {
  try {
    const docs = await Contact.find().sort({ createdAt: -1 }).lean();
    res.json(docs);
  } catch (e) { next(e); }
};
