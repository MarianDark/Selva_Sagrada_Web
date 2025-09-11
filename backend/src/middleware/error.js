module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(status).json({ message: err.message || 'Error interno' });
};
