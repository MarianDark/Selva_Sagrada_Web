const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_PORT) === '465',
  pool: true,               // ♻️ reusar conexiones
  maxConnections: 5,        // hasta 5 conexiones simultáneas
  maxMessages: 100,         // hasta 100 mensajes por conexión
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 🔍 Verificar al inicio (no rompe, solo avisa en logs)
transporter.verify()
  .then(() => console.log('✅ SMTP listo para enviar correos'))
  .catch(err => console.warn('⚠️  SMTP no verificado:', err?.message));

module.exports = { transporter };
