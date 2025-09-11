const { Schema, model } = require('mongoose');

const AvailabilitySchema = new Schema({
  date: { type: Date, required: true },
  slots: [{
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    capacity: { type: Number, default: 1, min: 1 },
  }],
}, { timestamps: true });

AvailabilitySchema.index({ date: 1 }, { unique: true });

module.exports = model('Availability', AvailabilitySchema);
