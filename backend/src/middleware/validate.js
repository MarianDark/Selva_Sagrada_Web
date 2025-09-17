const { validationResult } = require('express-validator')

const SENSITIVE_FIELDS = new Set(['password', 'newPassword', 'passwordHash', 'token'])

module.exports = (req, res, next) => {
  const result = validationResult(req)
  if (result.isEmpty()) return next()

  const safeErrors = result.array().map(e => {
    const copy = { ...e }
    if (SENSITIVE_FIELDS.has(copy.path || copy.param)) {
      delete copy.value
    }
    return copy
  })

  return res.status(422).json({ errors: safeErrors })
}
