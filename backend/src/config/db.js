const mongoose = require('mongoose');

module.exports = async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI no está configurado');

  // Si viene MONGODB_DBNAME lo usamos; si la URI ya trae /dbname, Mongoose lo respeta
  const dbName = process.env.MONGODB_DBNAME || undefined;

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    dbName, // <- forza nombre si lo das por env
    autoIndex: process.env.NODE_ENV !== 'production',
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8000,
    retryWrites: true,
    w: 'majority'
  });

  const conn = mongoose.connection;
  conn.on('connected', () => {
    const usedDb = conn.client?.options?.dbName || conn.name;
    console.log(`✅ MongoDB connected (db: ${usedDb})`);
  });
  conn.on('reconnectFailed', () => console.error('❌ MongoDB reconnect failed'));
  conn.on('error', (err) => console.error('MongoDB error:', err));
};
