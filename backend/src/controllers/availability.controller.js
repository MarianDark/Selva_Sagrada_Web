const Availability = require('../models/availability');
const Booking = require('../models/booking'); // <-- sin espacio

exports.getAvailability = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const q = {};
    if (from && to) {
      const f = new Date(from);
      const t = new Date(to);
      if (isNaN(+f) || isNaN(+t) || f > t) {
        return res.status(400).json({ message: 'Rango de fechas inválido' });
      }
      q.date = { $gte: f, $lte: t };
    }

    // 1) Trae disponibilidades
    const daysRaw = await Availability.find(q).lean();

    if (!daysRaw.length) return res.json([]);

    // Filtra días sin slots válidos
    const days = daysRaw
      .map(d => ({ ...d, slots: Array.isArray(d.slots) ? d.slots : [] }))
      .filter(d => d.slots.length > 0);

    if (!days.length) return res.json([]);

    // Rango bruto de fechas para buscar bookings superpuestos
    const allStarts = [];
    const allEnds = [];
    for (const d of days) {
      for (const s of d.slots) {
        if (s?.start && s?.end) {
          allStarts.push(+new Date(s.start));
          allEnds.push(+new Date(s.end));
        }
      }
    }
    if (!allStarts.length || !allEnds.length) return res.json([]);

    const minStart = new Date(Math.min(...allStarts));
    const maxEnd = new Date(Math.max(...allEnds));

    // 2) Busca bookings que toquen cualquier slot del rango (excluye canceladas)
    const bookings = await Booking.find({
      status: { $ne: 'cancelled' },
      start: { $lt: maxEnd },
      end: { $gt: minStart }
    }).select('start end status').lean();

    // 3) Para cada slot calcula las plazas restantes (capacity - solapes)
    const enriched = days.map(d => {
      const slots = (d.slots || []).map(sl => {
        const s = new Date(sl.start);
        const e = new Date(sl.end);
        const cap = Math.max(Number(sl.capacity || 1), 1);

        const overlapCount = bookings.reduce((acc, b) => {
          const bs = new Date(b.start);
          const be = new Date(b.end);
          return (bs < e && be > s) ? acc + 1 : acc;
        }, 0);

        const remaining = Math.max(cap - overlapCount, 0);
        return {
          start: s,
          end: e,
          capacity: cap,
          remaining,
          full: remaining <= 0
        };
      });

      return {
        _id: d._id,
        date: d.date,
        slots
      };
    });

    res.json(enriched);
  } catch (e) {
    next(e);
  }
};

exports.setAvailability = async (req, res, next) => {
  try {
    const { date, slots } = req.body;
    if (!date || !Array.isArray(slots)) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const d = new Date(date); d.setHours(0, 0, 0, 0);
    if (isNaN(+d)) return res.status(400).json({ message: 'Fecha inválida' });

    // Validar slots
    const norm = [];
    for (const sl of slots) {
      const s = new Date(sl.start);
      const e = new Date(sl.end);
      if (isNaN(+s) || isNaN(+e) || !(s < e)) {
        return res.status(400).json({ message: 'Slot inválido (start/end)' });
      }
      const capacity = Math.max(Number(sl.capacity || 1), 1);
      norm.push({ start: s, end: e, capacity });
    }

    // (Opcional) Validar que no haya solapes entre slots del mismo día
    norm.sort((a, b) => +a.start - +b.start);
    for (let i = 1; i < norm.length; i++) {
      if (norm[i - 1].end > norm[i].start) {
        return res.status(400).json({ message: 'Hay solapes entre slots del día' });
      }
    }

    const doc = await Availability.findOneAndUpdate(
      { date: d },
      { date: d, slots: norm },
      { upsert: true, new: true, runValidators: true }
    );
    res.status(201).json(doc);
  } catch (e) { next(e); }
};

exports.deleteAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Availability.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Disponibilidad no encontrada' });
    res.json({ message: 'Disponibilidad eliminada', id });
  } catch (e) { next(e); }
};
