// backend/src/models/contactmessage.js
const { Schema, model } = require('mongoose')

const PreferencesSchema = new Schema(
  {
    call: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
  },
  { _id: false }
)

const ContactMessageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    phone: {
      type: String,
      trim: true,
      minlength: 7,
      maxlength: 20,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 5000,
    },
    preferences: {
      type: PreferencesSchema,
      default: undefined, // solo guarda si viene
    },
    source: {
      type: String,
      default: 'footer',
      trim: true,
    },
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true },

    // Gestión básica
    status: {
      type: String,
      enum: ['new', 'read', 'archived'],
      default: 'new',
      index: true,
    },
    readAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret) {
        delete ret.__v
        return ret
      },
    },
    toObject: { virtuals: true, versionKey: false },
  }
)

// Índices útiles
ContactMessageSchema.index({ createdAt: -1 })
ContactMessageSchema.index({ email: 1 })

module.exports = model('ContactMessage', ContactMessageSchema)
