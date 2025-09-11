const { Schema, model } = require('mongoose');

const EmailTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, index: true },
  type: { type: String, enum: ['verify','reset'], required: true },
  expiresAt: { type: Date, required: true }
});

// TTL: expira exactamente en expiresAt
EmailTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model('EmailToken', EmailTokenSchema);
