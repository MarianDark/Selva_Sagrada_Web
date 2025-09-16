const { body } = require('express-validator')
const validate = require('../middleware/validate')
const Contact = require('../models/contactmessage')
const { sendMail } = require('../config/mailer')

// Escapador minimal para no tragar HTML en los correos
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

exports.create = [
  // Validaciones
  body('name').isString().trim().isLength({ min: 2, max: 120 }),
  body('email').optional({ nullable: true, checkFalsy: true }).isEmail().normalizeEmail(),
  body('phone').optional({ nullable: true, checkFalsy: true }).isString().trim().isLength({ min: 7, max: 20 }),
  body('message').isString().trim().isLength({ min: 5, max: 5000 }),
  body('preferences').optional().isObject(),
  validate,

  // Handler
  async (req, res, next) => {
    try {
      const { name, email, phone, message, preferences, source } = req.body

      // Al menos un medio de contacto (coherente con el frontend)
      if (!email && !phone) {
        return res.status(400).json({ message: 'Indica al menos un medio de contacto (email o teléfono).' })
      }

      // Persistencia
      const doc = await Contact.create({
        name: name?.trim(),
        email: email?.trim() || undefined,
        phone: phone?.trim() || undefined,
        message: message?.trim(),
        preferences: preferences || undefined,  // { call, email, whatsapp }
        source: source || 'footer',
        ip: req.ip,
        userAgent: req.get('user-agent'),
      })

      // Notificación al admin
      if (process.env.ADMIN_EMAIL) {
        try {
          const adminHtml = `
            <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.56">
              <h2 style="margin:0 0 8px">Nuevo contacto — Selva Sagrada</h2>
              <p><b>Nombre:</b> ${escapeHtml(name)}</p>
              <p><b>Email:</b> ${escapeHtml(email || '(no indicado)')}</p>
              <p><b>Teléfono:</b> ${escapeHtml(phone || '(no indicado)')}</p>
              ${
                preferences
                  ? `<p><b>Preferencias:</b> ${Object.entries(preferences)
                      .filter(([, v]) => v)
                      .map(([k]) => escapeHtml(k))
                      .join(', ') || '(sin preferencias)'}</p>`
                  : ''
              }
              <hr style="border:none;border-top:1px solid #eee;margin:12px 0" />
              <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
              <hr style="border:none;border-top:1px solid #eee;margin:12px 0" />
              <p style="font-size:12px;color:#666">
                <b>ID:</b> ${doc._id}<br />
                <b>IP:</b> ${escapeHtml(req.ip || '')}<br />
                <b>UA:</b> ${escapeHtml(req.get('user-agent') || '')}
              </p>
            </div>
          `

          await sendMail({
            to: process.env.ADMIN_EMAIL,
            subject: 'Nuevo contacto — Selva Sagrada',
            text:
              `Nombre: ${name}\n` +
              `Email: ${email || '(no indicado)'}\n` +
              `Teléfono: ${phone || '(no indicado)'}\n` +
              `Preferencias: ${
                preferences
                  ? Object.entries(preferences)
                      .filter(([, v]) => v)
                      .map(([k]) => k)
                      .join(', ') || '(sin preferencias)'
                  : '(no indicadas)'
              }\n\n` +
              `${message}\n\n` +
              `ID: ${doc._id}\nIP: ${req.ip || ''}\nUA: ${req.get('user-agent') || ''}`,
            html: adminHtml,
            replyTo: email || undefined,
          })
        } catch (err) {
          // No rompas la UX por un correo; loguea y sigue
          console.warn('[mail] admin notify failed:', err?.message)
        }
      }

      // Autoresponder al usuario (solo si dio email)
      if (email) {
        try {
          const userHtml = `
            <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.56">
              <p>Hola ${escapeHtml(name)},</p>
              <p>Gracias por escribirnos. Hemos recibido tu mensaje y te responderemos lo antes posible.</p>
              <p>Un abrazo,<br/>Equipo de Selva Sagrada</p>
              <hr style="border:none;border-top:1px solid #eee;margin:12px 0" />
              <p style="opacity:.85"><b>Tu mensaje:</b></p>
              <p style="white-space:pre-wrap;opacity:.85">${escapeHtml(message)}</p>
            </div>
          `
          await sendMail({
            to: email,
            subject: 'Hemos recibido tu mensaje – Selva Sagrada',
            text:
              `Hola ${name},\n\n` +
              `Gracias por escribirnos. Hemos recibido tu mensaje y te responderemos lo antes posible.\n\n` +
              `— Equipo de Selva Sagrada\n\n` +
              `Tu mensaje:\n${message}`,
            html: userHtml,
            replyTo: process.env.ADMIN_EMAIL || undefined,
          })
        } catch (err) {
          console.warn('[mail] autoresponder failed:', err?.message)
        }
      }

      return res.status(201).json({ ok: true, id: doc._id, message: 'Mensaje enviado' })
    } catch (e) {
      next(e)
    }
  },
]

// Listado simple (puedes paginar si te pones serio)
exports.list = async (req, res, next) => {
  try {
    const docs = await Contact.find().sort({ createdAt: -1 }).lean()
    res.json(docs)
  } catch (e) {
    next(e)
  }
}
