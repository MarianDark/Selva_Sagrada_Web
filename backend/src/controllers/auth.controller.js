const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const crypto = require('crypto');
const validate = require('../middleware/validate');
const User = require('../models/user');            // <- minúsculas
const EmailToken = require('../models/emailtoken'); // <- minúsculas
const { transporter } = require('../config/mailer');


const isProd = process.env.NODE_ENV === 'production';

// Reglas de validación para registro
const rulesRegister = [
  body('name').isLength({ min: 2 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
    .matches(/[A-Z]/).withMessage('Debe incluir mayúscula')
    .matches(/[a-z]/).withMessage('Debe incluir minúscula')
    .matches(/[0-9]/).withMessage('Debe incluir número')
    .matches(/[^A-Za-z0-9]/).withMessage('Debe incluir símbolo'),
];

// -------------------- REGISTER --------------------
exports.register = [
  ...rulesRegister,
  validate, // valida ANTES del handler
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ message: 'Email ya registrado' });

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({ name, email, passwordHash });

      const token = crypto.randomBytes(32).toString('hex');
      await EmailToken.create({
        userId: user._id,
        token,
        type: 'verify',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      });

      const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
      await transporter.sendMail({
        to: email,
        from: process.env.SMTP_FROM,
        subject: 'Confirma tu email – Selva Sagrada',
        html: `<p>Hola ${name}, confirma tu email:</p><p><a href="${verifyUrl}">Verificar</a></p>`,
      });

      res.status(201).json({ message: 'Registro exitoso. Revisa tu email.' });
    } catch (e) { next(e); }
  },
];

// -------------------- VERIFY EMAIL (GET o POST) --------------------
exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.body?.token ?? req.query?.token;
    if (!token) {
      if (req.method === 'GET') {
        return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=missing`);
      }
      return res.status(400).json({ message: 'Token requerido' });
    }

    const rec = await EmailToken.findOne({ token, type: 'verify' });
    if (!rec || rec.expiresAt < new Date()) {
      if (req.method === 'GET') {
        return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=invalid`);
      }
      return res.status(400).json({ message: 'Token inválido' });
    }

    await User.findByIdAndUpdate(rec.userId, { isEmailVerified: true });
    await rec.deleteOne();

    if (req.method === 'GET') {
      return res.redirect(`${process.env.CLIENT_URL}/login?verified=1`);
    }
    return res.json({ message: 'Email verificado' });
  } catch (e) { next(e); }
};

// -------------------- LOGIN --------------------
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Verifica tu email' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,                     // https solo en prod
      sameSite: isProd ? 'none' : 'lax',  // cross-site en prod; first-party en dev
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: 'Login OK',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (e) { next(e); }
};

// -------------------- LOGOUT --------------------
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
  res.json({ message: 'Logout' });
};

// -------------------- ME --------------------
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('_id name email role isEmailVerified');
    if (!user) return res.sendStatus(404);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    });
  } catch (e) { next(e); }
};

// -------------------- FORGOT PASSWORD --------------------
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requerido' });

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'Si el email existe, enviaremos instrucciones' });

    const token = crypto.randomBytes(32).toString('hex');
    await EmailToken.create({
      userId: user._id,
      token,
      type: 'reset',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60) // 1h
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      to: user.email,
      from: process.env.SMTP_FROM,
      subject: 'Restablecer contraseña – Selva Sagrada',
      html: `<p>Hola ${user.name || ''}, has solicitado restablecer tu contraseña.</p>
             <p>Haz clic aquí para continuar: <a href="${resetUrl}">Restablecer contraseña</a></p>
             <p>Si no fuiste tú, ignora este mensaje.</p>`
    });

    res.json({ message: 'Si el email existe, enviaremos instrucciones' });
  } catch (e) { next(e); }
};

// -------------------- RESET PASSWORD --------------------
const passwordRules = [
  body('password')
    .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
    .matches(/[A-Z]/).withMessage('Debe incluir mayúscula')
    .matches(/[a-z]/).withMessage('Debe incluir minúscula')
    .matches(/[0-9]/).withMessage('Debe incluir número')
    .matches(/[^A-Za-z0-9]/).withMessage('Debe incluir símbolo'),
  body('token').isString().notEmpty().withMessage('Token requerido')
];

exports.resetPassword = [
  ...passwordRules,
  validate, // valida ANTES del handler
  async (req, res, next) => {
    try {
      const { token, password } = req.body;

      const rec = await EmailToken.findOne({ token, type: 'reset' });
      if (!rec || rec.expiresAt < new Date()) {
        return res.status(400).json({ message: 'Token inválido o expirado' });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      await User.findByIdAndUpdate(rec.userId, { passwordHash });

      await rec.deleteOne();

      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (e) { next(e); }
  }
];