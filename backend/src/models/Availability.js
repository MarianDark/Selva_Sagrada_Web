const { Schema, model } = require('mongoose');
const AvailabilitySchema = new Schema({
date: { type: Date, required: true, index: true },
slots: [{
start: Date,
end: Date,
capacity: { type: Number, default: 1 },
}],
});
module.exports = model('Availability', AvailabilitySchema);