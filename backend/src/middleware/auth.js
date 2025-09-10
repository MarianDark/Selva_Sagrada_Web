const jwt = require('jsonwebtoken');
module.exports = function auth(requiredRole) {
return (req, res, next) => {
try {
const token = req.cookies?.token;
if (!token) return res.sendStatus(401);
const payload = jwt.verify(token, process.env.JWT_SECRET);
if (requiredRole && payload.role !== requiredRole) return res.sendStatus(403);
req.user = payload; next();
} catch { return res.sendStatus(401); }
}
}