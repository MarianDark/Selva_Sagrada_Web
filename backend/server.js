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
app.set('trust proxy', 1); // necesario en Render para cookies y rate-limit tras proxy

app.use(helmet());

// Orígenes permitidos (prod: CLIENT_URL; dev: también localhost:5173)
const ORIGINS = [
  process.env.CLIENT_URL,                  // e.g. https://tu-frontend.onrender.com o http://localhost:5173
  !isProd && 'http://localhost:5173',      // proxy Vite en desarrollo
].filter(Boolean);

app.use(cors({
  origin: ORIGINS,         // permite array
  credentials: true,       // necesario para cookies
  optionsSuccessStatus: 204,
}));

app.use(express.json());
app.use(cookieParser());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

if (!isProd) app.use(morgan('dev'));

/* Rutas */
app.get('/', (_, res) => res.json({ name: 'Selva Sagrada API', status: 'ok' }));
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/availability', require('./src/routes/availability.routes'));
app.use('/api/bookings', require('./src/routes/bookings.routes'));
app.use('/api/contact', require('./src/routes/contact.routes'));

// 404 para rutas no encontradas (opcional)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Not Found' });
  }
  next();
});

/* Error handler */
app.use(require('./src/middleware/error'));

/* Arranque */
const PORT = process.env.PORT || 3000;
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
