const Booking = require('../models/Booking');
const Availability = require('../models/Availability');
const { transporter } = require('../config/mailer');


exports.create = async (req,res,next)=>{
try {
const { start, end, service, name, email, phone, notes } = req.body;
// Check overlapping & capacity
const a = await Availability.findOne({ date: { $lte: new Date(start) },
'slots.start': { $lte: new Date(start) }, 'slots.end': { $gte: new Date(end) } });
if (!a) return res.status(400).json({ message:'Horario no disponible' });
const overlap = await Booking.findOne({ start: { $lt: new Date(end) }, end: { $gt: new Date(start) } });
if (overlap) return res.status(400).json({ message:'Ya hay una reserva en ese horario' });


const booking = await Booking.create({ userId: req.user?.id, start, end, service, name, email, phone, notes });


// Email a cliente
await transporter.sendMail({ to: email, from: process.env.SMTP_FROM,
subject: 'Reserva confirmada – Selva Sagrada',
html: `<p>¡Gracias ${name}! Tu reserva para ${service} está confirmada.</p>` });
// Notificación admin
await transporter.sendMail({ to: process.env.ADMIN_EMAIL, from: process.env.SMTP_FROM,
subject: `Nueva reserva – ${service}`,
html: `<p>${name} (${email}) reservó ${new Date(start).toLocaleString()} – ${new Date(end).toLocaleString()}</p>` });


res.status(201).json(booking);
} catch(e){ next(e); }
};


exports.mine = async (req,res,next)=>{
try { const list = await Booking.find({ userId: req.user.id }).sort('-start'); res.json(list); }
catch(e){ next(e); }
};


exports.all = async (req,res,next)=>{
try { const list = await Booking.find().sort('-start'); res.json(list); }
catch(e){ next(e); }
};