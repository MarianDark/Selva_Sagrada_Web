// backend/server.js
require("dotenv").config();
const { randomUUID } = require("crypto");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const connect = require("./src/config/db");
const pino = require("pino");
const pinoHttp = require("pino-http");

// === CORS centralizado ===
const { corsOptions, allowed } = require("./src/config/cors");

const app = express();
const isProd = process.env.NODE_ENV === "production";

/* Proxies (Render/NGINX) + seguridad base */
app.set("trust proxy", 1);
app.disable("x-powered-by");

/* Helmet */
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "'unsafe-eval'",
          "https://www.google.com",
          "https://www.gstatic.com",
        ],
        "connect-src": [
          "'self'",
          process.env.API_PUBLIC_ORIGIN || "https://api.ssselvasagrada.com",
          "https://www.google.com",
          "https://www.gstatic.com",
        ],
        "img-src": [
          "'self'",
          "data:",
          "https://www.google.com",
          "https://www.gstatic.com",
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "frame-src": ["'self'", "https://www.google.com"],
        "manifest-src": ["'self'"],
      },
    },
  })
);

/* ===== CORS con credenciales (centralizado) ===== */
app.use(cors(corsOptions));
// Preflight universal (OPTIONS)
app.options("*", cors(corsOptions));
// Evita caches raros en proxies intermedios
app.use((req, res, next) => {
  res.header("Vary", "Origin, Access-Control-Request-Headers");
  next();
});

/* Parsers */
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

/* ===== Sesión con cookies seguras (para subdominios .ssselvasagrada.com) =====
   Nota: tu autenticación principal va por JWT en cookie 'sid'. Esta sesión
   la mantengo por si usas flash/csrf u otras rutas stateful. Ajusta SameSite
   según necesites. Entre subdominios suele bastar 'lax'. */
const COOKIE_DOMAIN = isProd ? ".ssselvasagrada.com" : undefined;
const SESSION_SECRET =
  process.env.SESSION_SECRET || "cambia-ESTO-por-un-secreto-fuerte";

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true, // respetar secure detrás de proxy
    cookie: {
      secure: isProd, // exige HTTPS en prod
      httpOnly: true,
      sameSite: isProd ? "lax" : "lax",
      domain: COOKIE_DOMAIN, // comparte cookie entre api. y raíz en prod
      maxAge: 1000 * 60 * 60 * 24, // 1 día
    },
  })
);

/* Rate limits */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const tightLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
});
const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", tightLimiter);
app.use("/api/auth/register", tightLimiter);
app.use("/api/auth/forgot-password", tightLimiter);
app.use("/api/contact", contactLimiter);
app.use("/api/booking", bookingLimiter);

/* Logger (pino + pino-http) */
const transport = !isProd
  ? pino.transport({ target: "pino-pretty", options: { singleLine: true } })
  : undefined;

const logger = pino(
  {
    level: process.env.LOG_LEVEL || (isProd ? "warn" : "info"),
    redact: {
      paths: [
        "req.headers.cookie",
        "req.headers.authorization",
        'res.headers["set-cookie"]',
        "req.body.password",
        "req.body.newPassword",
        "req.body.passwordHash",
        "req.body.token",
        "req.query.password",
        "req.query.newPassword",
        "req.query.passwordHash",
        "req.query.token",
      ],
      censor: "[redacted]",
      remove: true,
    },
  },
  transport
);

const IGNORED_ROUTES = ["/api/health"];

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers["x-request-id"] || randomUUID(),
    autoLogging: {
      ignore: (req) =>
        req.method === "OPTIONS" ||
        IGNORED_ROUTES.some((p) => req.url.startsWith(p)),
    },
    customLogLevel: (res, err) => {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return isProd ? "silent" : "info";
    },
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url,
          ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress,
        };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  })
);

if (!isProd) logger.info({ allowed }, "CORS allowed origins");

/* Rutas básicas */
app.get("/", (_, res) => res.json({ name: "Selva Sagrada API", status: "ok" }));
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

/* Rutas API */
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/availability", require("./src/routes/availability.routes"));
app.use("/api/booking", require("./src/routes/booking.routes"));
app.use("/api/contact", require("./src/routes/contact.routes"));

/* 404 para /api desconocidas */
app.use((req, res, next) => {
  if (req.path.startsWith("/api/"))
    return res.status(404).json({ message: "Not Found" });
  next();
});

/* 404 genérico */
app.use((req, res, next) => {
  if (res.headersSent) return next();
  res.status(404).json({ error: "Not Found" });
});

/* Error handler */
app.use(require("./src/middleware/error"));

const PORT = process.env.PORT || 3000;

connect()
  .then(() => app.listen(PORT, () => logger.info(`API listening on :${PORT}`)))
  .catch((err) => {
    logger.error({ err }, "Error connecting to DB");
    process.exit(1);
  });

process.on("unhandledRejection", (reason) =>
  logger.error({ reason }, "Unhandled Rejection")
);
process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught Exception");
  process.exit(1);
});
