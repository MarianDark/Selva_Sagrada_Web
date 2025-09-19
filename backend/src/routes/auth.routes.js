// backend/src/routes/auth.routes.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const C = require("../controllers/auth.controller");

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const wrap = mw => Array.isArray(mw) ? mw.map(asyncHandler) : [asyncHandler(mw)];

// ========= Rutas Auth =========
router.post("/register", ...wrap(C.register));
router.get("/verify-email", ...wrap(C.verifyEmail));
router.post("/verify-email", ...wrap(C.verifyEmail));
router.post("/login", ...wrap(C.login));
router.post("/logout", ...wrap(C.logout));
router.get("/me", auth(), ...wrap(C.me));
router.post("/forgot-password", ...wrap(C.forgotPassword));
router.post("/reset-password", ...wrap(C.resetPassword));

module.exports = router;
