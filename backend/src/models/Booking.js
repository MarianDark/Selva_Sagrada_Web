const { Schema, model } = require('mongoose');
const BookingSchema = new Schema({
userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
name: String,
email: String,
phone: String,
service: { type: String, required: true },
notes: String,
start: { type: Date, required: true },
end: { type: Date, required: true },
status: { type: String, enum: ['pending','confirmed','cancelled'], default: 'confirmed' },
}, { timestamps: true });
BookingSchema.index({ start: 1, end: 1 });
module.exports = model('Booking', BookingSchema);