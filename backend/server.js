// backend/server.js
require("dotenv").config();
const { randomUUID } = require("crypto");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const connect = require("./src/config/db");
const pino = require("pino");
const pinoHttp = require("pino-http");

// CORS
const { corsOptions, allowed } = require("./src/config/cors");

const app = express();
const isProd = process.env.NODE_ENV === "production";

/* Proxy y seguridad base */
app.set("trust proxy", 1);
app.disable("x-powered-by");

/* ===== CORS (antes que nada) ===== */
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use((req, res, next) => {
  res.header("Vary", "Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

/* Parsers */
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

/* Helmet básico para API (CSP off) */
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

/* Rate limits (skip preflight) */
const baseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => req.method === "OPTIONS"
});
app.use(baseLimiter);

app.use("/api/auth/login", rateLimit({ windowMs: 10 * 60 * 1000, limit: 30, skip: r => r.method === "OPTIONS" }));
app.use("/api/auth/register", rateLimit({ windowMs: 10 * 60 * 1000, limit: 30, skip: r => r.method === "OPTIONS" }));
app.use("/api/auth/forgot-password", rateLimit({ windowMs: 10 * 60 * 1000, limit: 30, skip: r => r.method === "OPTIONS" }));
app.use("/api/contact", rateLimit({ windowMs: 10 * 60 * 1000, limit: 40, skip: r => r.method === "OPTIONS" }));
app.use("/api/booking", rateLimit({ windowMs: 10 * 60 * 1000, limit: 60, skip: r => r.method === "OPTIONS" }));

/* Logger */
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
        "req.query.token"
      ],
      censor: "[redacted]",
      remove: true
    }
  },
  transport
);

const IGNORED_ROUTES = ["/api/health"];

app.use(
  pinoHttp({
    logger,
    genReqId: req => req.headers["x-request-id"] || randomUUID(),
    autoLogging: {
      ignore: req =>
        req.method === "OPTIONS" ||
        IGNORED_ROUTES.some(p => req.url.startsWith(p))
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
          ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress
        };
      },
      res(res) {
        return { statusCode: res.statusCode };
      }
    }
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

/* 404 /api */
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "Not Found" });
  }
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
