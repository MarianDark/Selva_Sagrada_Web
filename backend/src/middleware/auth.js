const jwt = require('jsonwebtoken');

module.exports = function auth(requiredRole) {
  return (req, res, next) => {
    try {
      const bearer = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null;
      const token = req.cookies?.token || bearer;
      if (!token) return res.sendStatus(401);

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (requiredRole && payload.role !== requiredRole) return res.sendStatus(403);

      req.user = { id: payload.id, role: payload.role };
      next();
    } catch (e) {
      return res.sendStatus(401);
    }
  };
};
