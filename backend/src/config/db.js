const mongoose = require('mongoose');

module.exports = async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI no está configurado');

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    autoIndex: process.env.NODE_ENV !== 'production',
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000
  });

  mongoose.connection.on('connected', () => console.log('✅ MongoDB connected'));
  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
};
