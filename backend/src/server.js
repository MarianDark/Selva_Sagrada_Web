require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const connect = require('./config/db');

const app = express();

/* Seguridad y middlewares */
app.set('trust proxy', 1);
app.use(helmet());

const allowedOrigin = process.env.CLIENT_URL;
app.use(cors({
  origin: allowedOrigin ? [allowedOrigin] : false,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(morgan('dev'));

/* Rutas */
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/availability', require('./routes/availability.routes'));
app.use('/api/bookings', require('./routes/bookings.routes'));
app.use('/api/contact', require('./routes/contact.routes'));

/* Error handler */
app.use(require('./middleware/error'));

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
