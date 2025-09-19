// backend/src/config/cors.js
const isProd = process.env.NODE_ENV === 'production';

const allowed = [
  'https://ssselvasagrada.com',
  'https://www.ssselvasagrada.com',
  // añade aquí staging si lo usas, p.ej:
  // 'https://staging.ssselvasagrada.com',
  // en dev: Vite suele ser 5173
  ...(isProd ? [] : ['http://localhost:5173', 'http://127.0.0.1:5173'])
];

const corsOptions = {
  origin(origin, cb) {
    // permitir no-browser tools o same-origin
    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin no permitido: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400
};

module.exports = { corsOptions, allowed };
