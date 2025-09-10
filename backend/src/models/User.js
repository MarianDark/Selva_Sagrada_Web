const { Schema, model } = require('mongoose');


const UserSchema = new Schema({
name: { type: String, required: true, trim: true },
email: { type: String, required: true, unique: true, lowercase: true, index: true },
passwordHash: { type: String, required: true },
isEmailVerified: { type: Boolean, default: false },
role: { type: String, enum: ['user','admin'], default: 'user' },
}, { timestamps: true });


module.exports = model('User', UserSchema);