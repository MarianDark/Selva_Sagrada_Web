// backend/src/config/auth.js
const isProd = process.env.NODE_ENV === "production";

function getJwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) {
    if (isProd) {
      throw new Error("[AUTH] JWT_SECRET no está definido en producción");
    }
    return "insecure-dev-secret";
  }
  return s.trim();
}

module.exports = { getJwtSecret };
