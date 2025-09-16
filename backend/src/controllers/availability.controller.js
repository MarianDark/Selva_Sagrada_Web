const Availability = require('../models/Availability')
const Booking = require('../models/Booking')

exports.getAvailability = async (req, res, next) => {
  try {
    const { from, to } = req.query

    const q = {}
    if (from && to) {
      q.date = { $gte: new Date(from), $lte: new Date(to) }
    }

    // 1) Trae disponibilidades
    const days = await Availability.find(q).lean()

    if (!days.length) return res.json([])

    // Rango bruto de fechas para buscar bookings superpuestos
    const minStart = new Date(Math.min(...days.flatMap(d => d.slots.map(s => +new Date(s.start)))))
    const maxEnd   = new Date(Math.max(...days.flatMap(d => d.slots.map(s => +new Date(s.end)))))

    // 2) Busca bookings que toquen cualquier slot del rango (excluye canceladas)
    const bookings = await Booking.find({
      status: { $ne: 'cancelled' },
      start: { $lt: maxEnd },
      end:   { $gt: minStart }
    }).select('start end status').lean()

    // 3) Para cada slot calcula las plazas restantes (capacity - solapes)
    const enriched = days.map(d => {
      const slots = (d.slots || []).map(sl => {
        const s = new Date(sl.start)
        const e = new Date(sl.end)
        const cap = Number(sl.capacity || 1)

        const overlapCount = bookings.reduce((acc, b) => {
          const bs = new Date(b.start)
          const be = new Date(b.end)
          return (bs < e && be > s) ? acc + 1 : acc
        }, 0)

        const remaining = Math.max(cap - overlapCount, 0)
        return {
          start: s,
          end: e,
          capacity: cap,
          remaining,
          full: remaining <= 0
        }
      })

      return {
        _id: d._id,
        date: d.date,
        slots
      }
    })

    res.json(enriched)
  } catch (e) {
    next(e)
  }
}

exports.setAvailability = async (req, res, next) => {
  try {
    const { date, slots } = req.body
    if (!date || !Array.isArray(slots)) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' })
    }

    const d = new Date(date); d.setHours(0,0,0,0)

    // Validar slots
    const norm = []
    for (const sl of slots) {
      const s = new Date(sl.start)
      const e = new Date(sl.end)
      if (!(s < e)) return res.status(400).json({ message: 'Slot inválido (start/end)' })
      const capacity = Math.max(Number(sl.capacity || 1), 1)
      norm.push({ start: s, end: e, capacity })
    }

    // (Opcional) Validar que no haya solapes entre slots del mismo día
    norm.sort((a,b) => +a.start - +b.start)
    for (let i=1;i<norm.length;i++){
      if (norm[i-1].end > norm[i].start) {
        return res.status(400).json({ message: 'Hay solapes entre slots del día' })
      }
    }

    const doc = await Availability.findOneAndUpdate(
      { date: d },
      { date: d, slots: norm },
      { upsert: true, new: true, runValidators: true }
    )
    res.status(201).json(doc)
  } catch (e) { next(e) }
}

exports.deleteAvailability = async (req, res, next) => {
  try {
    const { id } = req.params
    const deleted = await Availability.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ message: 'Disponibilidad no encontrada' })
    res.json({ message: 'Disponibilidad eliminada', id })
  } catch (e) { next(e) }
}
