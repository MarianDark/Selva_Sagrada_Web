const Availability = require('../models/Availability')

// GET /api/availability
// Lista de bloques disponibles (puede filtrar por rango de fechas ?from=YYYY-MM-DD&to=YYYY-MM-DD)
exports.getAvailability = async (req, res, next) => {
  try {
    const { from, to } = req.query
    let query = {}

    if (from && to) {
      query.date = {
        $gte: new Date(from),
        $lte: new Date(to),
      }
    }

    const data = await Availability.find(query).lean()
    res.json(data)
  } catch (e) {
    next(e)
  }
}

// POST /api/availability
// Crear o actualizar disponibilidad (solo admin)
exports.setAvailability = async (req, res, next) => {
  try {
    const { date, slots } = req.body
    if (!date || !slots) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' })
    }

    // Normalizamos la fecha (solo día)
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)

    // slots: [{ start: Date, end: Date, capacity: Number }]
    const doc = await Availability.findOneAndUpdate(
      { date: d },
      { date: d, slots },
      { upsert: true, new: true }
    )

    res.status(201).json(doc)
  } catch (e) {
    next(e)
  }
}

// DELETE /api/availability/:id
// Eliminar disponibilidad completa de un día
exports.deleteAvailability = async (req, res, next) => {
  try {
    const { id } = req.params
    const deleted = await Availability.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ message: 'Disponibilidad no encontrada' })
    }
    res.json({ message: 'Disponibilidad eliminada', id })
  } catch (e) {
    next(e)
  }
}
