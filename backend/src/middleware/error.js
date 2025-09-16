module.exports = (err, req, res, next) => {
  // 🔥 Log solo en dev/staging, o siempre si quieres
  if (process.env.NODE_ENV !== 'production') {
    console.error('🔥 Server error:', err)
  }

  if (res.headersSent) return next(err)

  const status = err.status || err.statusCode || 500

  // Respuesta JSON clara y nunca vacía
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    code: err.code || undefined, // opcional, útil si lanzas errores con codes propios
  })
}
