const { Schema, model } = require('mongoose');

const ContactMessageSchema = new Schema({
  name: String,
  email: String,
  message: String,
  source: { type: String, default: 'footer' },
}, { timestamps: true });

module.exports = model('ContactMessage', ContactMessageSchema);
