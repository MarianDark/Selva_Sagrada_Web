const { body } = require('express-validator');
const validate = require('../middleware/validate');
const Availability = require('../models/Availability');
const Booking = require('../models/Booking');
const User = require('../models/User'); // ⬅️ necesario para tomar datos del usuario
const { transporter } = require('../config/mailer');

const rulesCreate = [
  body('start').isISO8601().toDate(),
  body('end').isISO8601().toDate(),
  body('service').isString().isLength({ min: 2 }),
  // Ya no aceptamos email del body: se toma del usuario logueado
  body('name').optional().isString().isLength({ min: 2 }),
  body('phone').optional().isString().isLength({ min: 6 }),
];

exports.create = [
  ...rulesCreate,
  validate,
  async (req, res, next) => {
    try {
      // 🔒 Requiere login (además la ruta usa auth())
      if (!req.user?.id) {
        return res.status(401).json({ message: 'Debes iniciar sesión para reservar' });
      }

      const { start, end, service, name, phone, notes } = req.body;

      // Usuario autenticado
      const u = await User.findById(req.user.id).lean();
      if (!u) return res.status(401).json({ message: 'Sesión inválida' });

      const userEmail = u.email;
      const userName = u.name || name || '';

      const s = new Date(start);
      const e = new Date(end);
      if (!(s < e)) return res.status(400).json({ message: 'Rango de fechas inválido' });

      // Encontrar día y slot compatible
      const day = new Date(s); day.setHours(0,0,0,0);
      const avail = await Availability.findOne({ date: day }).lean();
      if (!avail) return res.status(400).json({ message: 'Horario no disponible' });

      const slot = (avail.slots || []).find(sl =>
        new Date(sl.start) <= s && new Date(sl.end) >= e
      );
      if (!slot) return res.status(400).json({ message: 'Horario no disponible' });

      // Comprobar capacidad en ese intervalo concreto (excluye canceladas)
      const overlappingCount = await Booking.countDocuments({
        start: { $lt: e },
        end:   { $gt: s },
        status: { $ne: 'cancelled' }
      });

      if (slot.capacity && overlappingCount >= slot.capacity) {
        return res.status(400).json({ message: 'Capacidad completa para ese horario' });
      }

      const doc = await Booking.create({
        userId: req.user.id,
        start: s,
        end: e,
        service,
        name: userName,
        email: userEmail,
        phone,
        notes,
        // status por defecto: 'confirmed' (en el schema)
      });

      // Formateo bonito con TZ Madrid
      const fmt = new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Europe/Madrid'
      });
      const rango = `${fmt.format(s)} – ${fmt.format(e)}`;

      // Plantillas de email
      const subjectUser = 'Reserva confirmada – Selva Sagrada';
      const subjectAdmin = `Nueva reserva – ${service}`;

      const htmlUser = `
        <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
          <h2>¡Gracias ${userName || ''}!</h2>
          <p>Tu reserva para <b>${service}</b> está <b>confirmada</b>.</p>
          <p><b>Fecha y hora:</b> ${rango}</p>
          ${phone ? `<p><b>Teléfono:</b> ${phone}</p>` : ''}
          ${notes ? `<p><b>Notas:</b> ${notes}</p>` : ''}
          <p>Si necesitas cancelar o cambiar, responde a este email.</p>
        </div>`;

      const htmlAdmin = `
        <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
          <h3>Nueva reserva</h3>
          <p><b>Servicio:</b> ${service}</p>
          <p><b>Cliente:</b> ${userName} (${userEmail})</p>
          ${phone ? `<p><b>Teléfono:</b> ${phone}</p>` : ''}
          <p><b>Horario:</b> ${rango}</p>
          ${notes ? `<p><b>Notas:</b> ${notes}</p>` : ''}
          <p><b>ID:</b> ${doc._id}</p>
        </div>`;

      // Email a cliente (siempre, porque el email viene del usuario logueado)
      try {
        await transporter.sendMail({
          to: userEmail,
          from: process.env.SMTP_FROM,
          subject: subjectUser,
          html: htmlUser
        });
      } catch (_) {}

      // Notificación admin
      if (process.env.ADMIN_EMAIL) {
        try {
          await transporter.sendMail({
            to: process.env.ADMIN_EMAIL,
            from: process.env.SMTP_FROM,
            subject: subjectAdmin,
            html: htmlAdmin
          });
        } catch (_) {}
      }

      res.status(201).json(doc);
    } catch (e) { next(e); }
  }
];

exports.mine = async (req, res, next) => {
  try {
    const list = await Booking.find({ userId: req.user.id }).sort('-start');
    res.json(list);
  } catch (e) { next(e); }
};

exports.all = async (req, res, next) => {
  try {
    const list = await Booking.find().sort('-start');
    res.json(list);
  } catch (e) { next(e); }
};

exports.cancel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Booking.findById(id);
    if (!doc) return res.status(404).json({ message: 'Reserva no encontrada' });

    // Permitir cancelar si es dueño o admin
    if (String(doc.userId || '') !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    doc.status = 'cancelled';
    await doc.save();

    res.json({ message: 'Reserva cancelada', id });
  } catch (e) { next(e); }
};
