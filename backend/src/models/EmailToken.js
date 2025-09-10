const { Schema, model } = require('mongoose');
const EmailTokenSchema = new Schema({
userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
token: { type: String, required: true, index: true },
type: { type: String, enum: ['verify','reset'], required: true },
expiresAt: { type: Date, required: true, index: { expires: '0s' } },
});
module.exports = model('EmailToken', EmailTokenSchema);