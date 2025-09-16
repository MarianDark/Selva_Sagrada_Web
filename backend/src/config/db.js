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

  const conn = mongoose.connection;
  conn.on('connected', () => console.log('✅ MongoDB connected'));
  conn.on('reconnectFailed', () => console.error('❌ MongoDB reconnect failed'));
  conn.on('error', (err) => console.error('MongoDB error:', err));
};
