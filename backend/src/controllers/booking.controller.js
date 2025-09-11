const { body } = require('express-validator');
const validate = require('../middleware/validate');
const Availability = require('../models/Availability');
const Booking = require('../models/Booking');
const { transporter } = require('../config/mailer');

const rulesCreate = [
  body('start').isISO8601().toDate(),
  body('end').isISO8601().toDate(),
  body('service').isString().isLength({ min: 2 }),
  body('name').optional().isString().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isString().isLength({ min: 6 }),
];

exports.create = [
  ...rulesCreate,
  validate,
  async (req, res, next) => {
    try {
      const { start, end, service, name, email, phone, notes } = req.body;
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
        userId: req.user?.id,
        start: s,
        end: e,
        service,
        name, email, phone, notes
      });

      // Email a cliente
      if (email) {
        try {
          await transporter.sendMail({
            to: email,
            from: process.env.SMTP_FROM,
            subject: 'Reserva confirmada – Selva Sagrada',
            html: `<p>¡Gracias ${name || ''}! Tu reserva para <b>${service}</b> está confirmada.</p>
                   <p>${s.toLocaleString()} – ${e.toLocaleString()}</p>`
          });
        } catch (_) {}
      }

      // Notificación admin
      if (process.env.ADMIN_EMAIL) {
        try {
          await transporter.sendMail({
            to: process.env.ADMIN_EMAIL,
            from: process.env.SMTP_FROM,
            subject: `Nueva reserva – ${service}`,
            html: `<p>${name || 'Sin nombre'} (${email || 'sin email'})</p>
                   <p>${s.toLocaleString()} – ${e.toLocaleString()}</p>`
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
