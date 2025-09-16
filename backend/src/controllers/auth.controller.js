const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body } = require('express-validator')
const crypto = require('crypto')
const validate = require('../middleware/validate')
const User = require('../models/user')
const EmailToken = require('../models/emailtoken')
const { transporter } = require('../config/mailer')

const isProd = process.env.NODE_ENV === 'production'
const COOKIE_NAME   = process.env.SESSION_COOKIE_NAME || 'sid'
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7d

function COOKIENAME_SAFE(name) { return String(name || '').trim() || 'sid' }

function getCookieOptions() {
  const base = { httpOnly: true, path: '/', maxAge: COOKIE_MAX_AGE }
  if (isProd) { base.secure = true; base.sameSite = 'none'; if (COOKIE_DOMAIN) base.domain = COOKIE_DOMAIN }
  else { base.secure = false; base.sameSite = 'lax' }
  return base
}

/* Validaciones */ 
const rulesRegister = [
  body('name').isLength({ min: 2 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
    .matches(/[A-Z]/).withMessage('Debe incluir mayúscula')
    .matches(/[a-z]/).withMessage('Debe incluir minúscula')
    .matches(/[0-9]/).withMessage('Debe incluir número')
    .matches(/[^A-Za-z0-9]/).withMessage('Debe incluir símbolo'),
]

const rulesReset = [
  body('password')
    .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
    .matches(/[A-Z]/).withMessage('Debe incluir mayúscula')
    .matches(/[a-z]/).withMessage('Debe incluir minúscula')
    .matches(/[0-9]/).withMessage('Debe incluir número')
    .matches(/[^A-Za-z0-9]/).withMessage('Debe incluir símbolo'),
  body('token').isString().notEmpty().withMessage('Token requerido'),
]

/* REGISTER (sin captcha) */
exports.register = [
  ...rulesRegister,
  validate,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body
      const exists = await User.findOne({ email })
      if (exists) return res.status(409).json({ message: 'Email ya registrado' })

      const passwordHash = await bcrypt.hash(password, 12)
      const user = await User.create({ name, email, passwordHash })

      const token = crypto.randomBytes(32).toString('hex')
      await EmailToken.create({
        userId: user._id,
        token,
        type: 'verify',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      })

      const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`

      try {
        await transporter.sendMail({
          to: email,
          from: process.env.SMTP_FROM,
          subject: 'Confirma tu email – Selva Sagrada',
          html: `<p>Hola ${name},</p><p>Confirma tu email:</p><p><a href="${verifyUrl}">Verificar</a></p>`,
        })
      } catch (err) {
        console.warn('[MAIL] Error enviando verificación:', err?.message)
      }

      res.status(201).json({ message: 'Registro exitoso. Revisa tu email.' })
    } catch (e) { next(e) }
  },
]

/* VERIFY EMAIL */
exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.body?.token ?? req.query?.token
    if (!token) {
      if (req.method === 'GET') return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=missing`)
      return res.status(400).json({ message: 'Token requerido' })
    }

    const rec = await EmailToken.findOne({ token, type: 'verify' })
    if (!rec || rec.expiresAt < new Date()) {
      if (req.method === 'GET') return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=invalid`)
      return res.status(400).json({ message: 'Token inválido' })
    }

    await User.findByIdAndUpdate(rec.userId, { isEmailVerified: true })
    await rec.deleteOne()

    if (req.method === 'GET') return res.redirect(`${process.env.CLIENT_URL}/login?verified=1`)
    res.json({ message: 'Email verificado' })
  } catch (e) { next(e) }
}

/* LOGIN (con captcha en la ruta) */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const u = await User.findOne({ email })
    if (!u) return res.status(401).json({ message: 'Credenciales inválidas' })

    const ok = await bcrypt.compare(password, u.passwordHash)
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' })

    if (!u.isEmailVerified) return res.status(403).json({ message: 'Verifica tu email' })

    const token = jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.cookie(COOKIENAME_SAFE(COOKIE_NAME), token, getCookieOptions())

    res.json({ message: 'Login OK', user: { id: u._id, name: u.name, email: u.email, role: u.role } })
  } catch (e) { next(e) }
}

/* LOGOUT */
exports.logout = (req, res) => {
  const opts = getCookieOptions()
  delete opts.maxAge
  res.clearCookie(COOKIENAME_SAFE(COOKIE_NAME), opts)
  res.json({ message: 'Logout' })
}

/* ME */
exports.me = async (req, res, next) => {
  try {
    const u = await User.findById(req.user.id).select('_id name email role isEmailVerified')
    if (!u) return res.sendStatus(404)
    res.json({ id: u._id, name: u.name, email: u.email, role: u.role, isEmailVerified: u.isEmailVerified })
  } catch (e) { next(e) }
}

/* FORGOT / RESET (sin captcha) */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email requerido' })

    const u = await User.findOne({ email })
    if (!u) return res.json({ message: 'Si el email existe, enviaremos instrucciones' })

    const token = crypto.randomBytes(32).toString('hex')
    await EmailToken.create({
      userId: u._id,
      token,
      type: 'reset',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    })

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`

    try {
      await transporter.sendMail({
        to: u.email,
        from: process.env.SMTP_FROM,
        subject: 'Restablecer contraseña – Selva Sagrada',
        html: `<p>Hola ${u.name || ''}, has solicitado restablecer tu contraseña.</p>
               <p>Haz clic aquí: <a href="${resetUrl}">Restablecer contraseña</a></p>
               <p>Si no fuiste tú, ignora este mensaje.</p>`
      })
    } catch (err) {
      console.warn('[MAIL] Error enviando reset:', err?.message)
    }

    res.json({ message: 'Si el email existe, enviaremos instrucciones' })
  } catch (e) { next(e) }
}

exports.resetPassword = [
  ...rulesReset,
  validate,
  async (req, res, next) => {
    try {
      const { token, password } = req.body
      const rec = await EmailToken.findOne({ token, type: 'reset' })
      if (!rec || rec.expiresAt < new Date()) {
        return res.status(400).json({ message: 'Token inválido o expirado' })
      }
      const passwordHash = await bcrypt.hash(password, 12)
      await User.findByIdAndUpdate(rec.userId, { passwordHash })
      await rec.deleteOne()
      res.json({ message: 'Contraseña actualizada correctamente' })
    } catch (e) { next(e) }
  }
]
