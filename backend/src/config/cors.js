// backend/src/config/cors.js
const isProd = process.env.NODE_ENV === "production";

function parseList(name, fallback = []) {
  const raw = process.env[name];
  if (!raw) return fallback;
  return raw
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

const defaultAllowed = [
  "https://ssselvasagrada.com",
  "https://www.ssselvasagrada.com",
  ...(isProd ? [] : ["http://localhost:5173", "http://127.0.0.1:5173"])
];

const allowed = Array.from(new Set([
  ...defaultAllowed,
  ...parseList("CLIENT_URLS"),
  process.env.CLIENT_URL || ""
])).filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin no permitido: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Set-Cookie"],
  maxAge: 86400
};

module.exports = { corsOptions, allowed };
