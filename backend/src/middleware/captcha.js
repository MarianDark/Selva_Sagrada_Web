const axios = require('axios');

module.exports = async function captcha(req, res, next) {
  try {
    if (process.env.NODE_ENV !== 'production' || process.env.RECAPTCHA_BYPASS === '1') {
      return next();
    }
    const token = req.body.captchaToken;
    if (!token) return res.status(400).json({ message: 'Captcha requerido' });

    const { data } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`
    );
    if (!data.success || (data.score !== undefined && data.score < 0.5)) {
      return res.status(400).json({ message: 'Captcha inválido' });
    }
    next();
  } catch (e) { next(e); }
};
