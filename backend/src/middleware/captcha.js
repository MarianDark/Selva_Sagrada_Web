const axios = require('axios');
module.exports = async function captcha(req, res, next) {
try {
const token = req.body.captchaToken;
if (!token) return res.status(400).json({ message: 'Captcha requerido' });
const secret = process.env.RECAPTCHA_SECRET;
const { data } = await axios.post(
`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
);
if (!data.success || (data.score !== undefined && data.score < 0.5)) {
return res.status(400).json({ message: 'Captcha inválido' });
}
next();
} catch (e) { next(e); }
};