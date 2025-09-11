require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connect = require('./src/config/db');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

/* Seguridad y middlewares */
app.set('trust proxy', 1); // necesario en Render / proxies para cookies
app.use(helmet());

/** Orígenes permitidos */
const ORIGINS = Array.from(new Set(
  [
    process.env.CLIENT_URL,
    ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',') : []),
    !isProd && 'http://localhost:5173',
  ].filter(Boolean).map(s => s.trim())
));

const corsOptions = {
  origin(origin, cb) {
    // Permite healthchecks y curl (sin origen)
    if (!origin) return cb(null, true);
    const ok = ORIGINS.includes(origin);
    return cb(ok ? null : new Error('Not allowed by CORS'), ok);
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

if (!isProd) {
  app.use(morgan('dev'));
  console.log('CORS ORIGINS →', ORIGINS);
}

/* Rutas básicas */
app.get('/', (_, res) => res.json({ name: 'Selva Sagrada API', status: 'ok' }));
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

/* Rutas API */
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/availability', require('./src/routes/availability.routes'));
app.use('/api/booking', require('./src/routes/booking.routes'));
app.use('/api/contact', require('./src/routes/contact.routes'));

/* 404 para rutas /api desconocidas */
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Not Found' });
  }
  next();
});

/* Error handler */
app.use(require('./src/middleware/error'));

const PORT = process.env.PORT || 3000;

/* Arranque */
connect()
  .then(() => app.listen(PORT, () => console.log(`API listening on :${PORT}`)))
  .catch((err) => {
    console.error('❌ Error connecting to DB:', err);
    process.exit(1);
  });

process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
