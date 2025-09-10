const Booking = require('../models/Booking');
const Availability = require('../models/Availability');
const { transporter } = require('../config/mailer');


function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

exports.create = async (req, res, next) => {
  try {
    const { start, end, service, name, email, phone, notes } = req.body;
    const s = new Date(start);
    const e = new Date(end);

    // Encontrar día y slot compatible
    const day = new Date(s); day.setHours(0,0,0,0);
    const avail = await Availability.findOne({ date: day }).lean();
    if (!avail) return res.status(400).json({ message: 'Horario no disponible' });

    const slot = (avail.slots || []).find(sl =>
      new Date(sl.start) <= s && new Date(sl.end) >= e
    );
    if (!slot) return res.status(400).json({ message: 'Horario no disponible' });

    // Comprobar capacidad en ese intervalo concreto
    const count = await Booking.countDocuments({
      start: { $lt: e },
      end:   { $gt: s }
    });
    if (slot.capacity && count >= slot.capacity) {
      return res.status(400).json({ message: 'Capacidad completa para ese horario' });
    }

    const booking = await Booking.create({
      userId: req.user?.id,
      start: s,
      end: e,
      service,
      name, email, phone, notes
    });

    // Email a cliente
    if (email) {
      await transporter.sendMail({
        to: email,
        from: process.env.SMTP_FROM,
        subject: 'Reserva confirmada – Selva Sagrada',
        html: `<p>¡Gracias ${name || ''}! Tu reserva para <b>${service}</b> está confirmada.</p>
               <p>${s.toLocaleString()} – ${e.toLocaleString()}</p>`
      });
    }

    // Notificación admin
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        to: process.env.ADMIN_EMAIL,
        from: process.env.SMTP_FROM,
        subject: `Nueva reserva – ${service}`,
        html: `<p>${name} (${email || 'sin email'})</p>
               <p>${s.toLocaleString()} – ${e.toLocaleString()}</p>`
      });
    }

    res.status(201).json(booking);
  } catch (e) { next(e); }
};

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
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });

    // Permitir cancelar si es dueño o admin
    if (String(booking.userId) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Reserva cancelada', id });
  } catch (e) { next(e); }
};