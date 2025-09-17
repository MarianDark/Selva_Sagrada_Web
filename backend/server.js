// backend/server.js
require('dotenv').config();
const { randomUUID } = require('crypto');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connect = require('./src/config/db');
const pino = require('pino');
const pinoHttp = require('pino-http');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

/* Proxies (Render/NGINX) + seguridad base */
app.set('trust proxy', 1);
app.disable('x-powered-by');

/* Helmet */
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // Lo básico
        "default-src": ["'self'"],

        // Scripts: permitimos eval temporalmente y los dominios que usas
        "script-src": [
          "'self'",
          "'unsafe-eval'",              // ← habilita bundles que usan new Function/eval
          "https://www.google.com",     // reCAPTCHA
          "https://www.gstatic.com"     // reCAPTCHA
        ],

        // AJAX/WebSocket
        "connect-src": [
          "'self'",
          process.env.API_PUBLIC_ORIGIN || "https://api.ssselvasagrada.com",
          "https://www.google.com",
          "https://www.gstatic.com"
        ],

        // Imágenes
        "img-src": ["'self'", "data:", "https://www.google.com", "https://www.gstatic.com"],

        // CSS (Google Fonts requiere 'unsafe-inline' para sus inlines)
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],

        // Fuentes
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],

        // iframes (reCAPTCHA)
        "frame-src": ["'self'", "https://www.google.com"],

        // Manifiesto PWA y demás
        "manifest-src": ["'self'"],
      },
    },
  })
)

/* ===== CORS con credenciales ===== */
const RAW_ORIGINS = Array.from(
  new Set(
    [
      process.env.CLIENT_URL,
      ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',') : []),
      !isProd && 'http://localhost:5173',
      process.env.ALLOW_RENDER_ORIGIN === '1' && 'https://selva-sagrada-web.onrender.com',
    ]
      .filter(Boolean)
      .map(s => s.trim())
  )
);

const ALLOWED_ORIGINS = RAW_ORIGINS
  .map(u => {
    try { return new URL(u).origin; } catch { return null; }
  })
  .filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // healthchecks/cURL
    const ok = ALLOWED_ORIGINS.includes(origin);
    return cb(ok ? null : new Error(`Not allowed by CORS: ${origin}`), ok);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

/* Parsers */
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

/* Rate limits */
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

const tightLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false });
const contactLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 40, standardHeaders: true, legacyHeaders: false });
const bookingLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false });

app.use('/api/auth/login', tightLimiter);
app.use('/api/auth/register', tightLimiter);
app.use('/api/auth/forgot-password', tightLimiter);
app.use('/api/contact', contactLimiter);
app.use('/api/booking', bookingLimiter);

/* Logger (pino + pino-http) */
const transport = !isProd ? pino.transport({ target: 'pino-pretty', options: { singleLine: true } }) : undefined;

const logger = pino(
  {
    level: process.env.LOG_LEVEL || (isProd ? 'warn' : 'info'),
    redact: {
      paths: [
        // Cookies y auth headers
        'req.headers.cookie',
        'req.headers.authorization',
        'res.headers["set-cookie"]',
        // Cuerpos con credenciales o secretos
        'req.body.password',
        'req.body.newPassword',
        'req.body.passwordHash',
        'req.body.token',
        // Queries por si algún iluminado manda cosas sensibles ahí
        'req.query.password',
        'req.query.newPassword',
        'req.query.passwordHash',
        'req.query.token'
      ],
      censor: '[redacted]',
      remove: true,
    },
  },
  transport
);

const IGNORED_ROUTES = ['/api/auth/me', '/api/health'];

app.use(
  pinoHttp({
    logger,
    genReqId: req => req.headers['x-request-id'] || randomUUID(),
    autoLogging: {
      ignore: req => req.method === 'OPTIONS' || IGNORED_ROUTES.some(p => req.url.startsWith(p)),
    },
    customLogLevel: (res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return isProd ? 'silent' : 'info';
    },
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url,
          ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
        };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  })
);

if (!isProd) logger.info({ allowed: ALLOWED_ORIGINS }, 'CORS ALLOWED_ORIGINS');

/* Rutas básicas */
app.get('/', (_, res) => res.json({ name: 'Selva Sagrada API', status: 'ok' }));
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

/* Rutas API */
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/availability', require('./src/routes/availability.routes'));
app.use('/api/booking', require('./src/routes/booking.routes'));
app.use('/api/contact', require('./src/routes/contact.routes'));

/* 404 para /api desconocidas */
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ message: 'Not Found' });
  next();
});

/* 404 genérico */
app.use((req, res, next) => {
  if (res.headersSent) return next();
  res.status(404).json({ error: 'Not Found' });
});

/* Error handler */
app.use(require('./src/middleware/error'));

const PORT = process.env.PORT || 3000;

connect()
  .then(() => app.listen(PORT, () => logger.info(`API listening on :${PORT}`)))
  .catch(err => {
    logger.error({ err }, 'Error connecting to DB');
    process.exit(1);
  });

process.on('unhandledRejection', reason => logger.error({ reason }, 'Unhandled Rejection'));
process.on('uncaughtException', err => {
  logger.error({ err }, 'Uncaught Exception');
  process.exit(1);
});
