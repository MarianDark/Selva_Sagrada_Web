require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const connect = require('./src/config/db')

const app = express()
const isProd = process.env.NODE_ENV === 'production'

/* Proxies (Render/NGINX) + seguridad base */
app.set('trust proxy', 1)
app.disable('x-powered-by')

/* Helmet */
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

/* ===== CORS con credenciales ===== */
const RAW_ORIGINS = Array.from(
  new Set(
    [
      process.env.CLIENT_URL,
      ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',') : []),
      !isProd && 'http://localhost:5173',
      // si todavía usas el dominio de Render durante la transición:
      process.env.ALLOW_RENDER_ORIGIN === '1' && 'https://selva-sagrada-web.onrender.com',
    ]
      .filter(Boolean)
      .map((s) => s.trim())
  )
)

const ALLOWED_ORIGINS = RAW_ORIGINS
  .map((u) => {
    try { return new URL(u).origin } catch { return null }
  })
  .filter(Boolean)

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true) // healthchecks/cURL
    const ok = ALLOWED_ORIGINS.includes(origin)
    return cb(ok ? null : new Error(`Not allowed by CORS: ${origin}`), ok)
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions)) // preflight global

/* Parsers */
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

/* Rate limit global */
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}))

/* Rate limits específicos */
const tightLimiter   = rateLimit({ windowMs: 10 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false })
const contactLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 40, standardHeaders: true, legacyHeaders: false })
const bookingLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false })

app.use('/api/auth/login', tightLimiter)
app.use('/api/auth/register', tightLimiter)
app.use('/api/auth/forgot-password', tightLimiter)
app.use('/api/contact', contactLimiter)
app.use('/api/booking', bookingLimiter)

if (!isProd) {
  app.use(morgan('dev'))
  console.log('CORS ALLOWED_ORIGINS →', ALLOWED_ORIGINS)
}

/* Rutas básicas */
app.get('/',        (_, res) => res.json({ name: 'Selva Sagrada API', status: 'ok' }))
app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

/* Rutas API */
app.use('/api/auth',         require('./src/routes/auth.routes'))
app.use('/api/availability', require('./src/routes/availability.routes'))
app.use('/api/booking',      require('./src/routes/booking.routes'))
app.use('/api/contact',      require('./src/routes/contact.routes'))

/* 404 para /api desconocidas */
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ message: 'Not Found' })
  next()
})

/* 404 genérico para el resto */
app.use((req, res, next) => {
  if (res.headersSent) return next()
  res.status(404).json({ error: 'Not Found' })
})

/* Error handler */
app.use(require('./src/middleware/error'))

const PORT = process.env.PORT || 3000

connect()
  .then(() => app.listen(PORT, () => console.log(`API listening on :${PORT}`)))
  .catch((err) => {
    console.error('❌ Error connecting to DB:', err)
    process.exit(1)
  })

process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason))
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})
