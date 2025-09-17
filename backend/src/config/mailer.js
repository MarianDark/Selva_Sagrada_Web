const nodemailer = require('nodemailer');

const isProd = process.env.NODE_ENV === 'production';

// Credenciales y host
const HOST = process.env.SMTP_HOST;
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;

/// Puerto y secure coherentes (465 = TLS implícito, 587 = STARTTLS)
const PORT = Number(process.env.SMTP_PORT || (isProd ? 465 : 587));
const SECURE = PORT === 465;

// From por defecto
const FROM = process.env.SMTP_FROM || (USER ? `Selva Sagrada <${USER}>` : 'Selva Sagrada <no-reply@localhost>');

const transporter = nodemailer.createTransport({
  host: HOST,
  port: PORT,
  secure: SECURE, // true en 465, false en 587
  auth: USER && PASS ? { user: USER, pass: PASS } : undefined,

  // Reusar conexiones SOLO en producción
  pool: isProd,
  maxConnections: isProd ? 3 : 1,
  maxMessages: isProd ? 50 : 10,

  // Evita golpear límites del proveedor
  rateDelta: 1000, // ventana de 1s
  rateLimit: 10,   // hasta 10 mensajes/s

  tls: { minVersion: 'TLSv1.2' },

  logger: !isProd,
  // Si configuras DKIM en el futuro:
  // dkim: {
  //   domainName: 'ssselvasagrada.com',
  //   keySelector: 'default',
  //   privateKey: process.env.DKIM_PRIVATE_KEY
  // }
});

transporter.verify()
  .then(() => console.log('✅ SMTP listo para enviar correos'))
  .catch(err => console.warn('⚠️  SMTP no verificado:', err?.message));

async function sendMail({ to, subject, text, html, cc, bcc, replyTo, attachments, headers, envelope }) {
  return transporter.sendMail({
    from: FROM,
    to,
    subject,
    text,
    html,
    cc,
    bcc,
    replyTo,
    attachments,
    headers,
    envelope,
  });
}

module.exports = { transporter, sendMail };
