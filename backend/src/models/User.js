// backend/src/models/User.js
const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    isEmailVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(_doc, ret) {
        delete ret.passwordHash;
        return ret;
      }
    },
    toObject: { versionKey: false }
  }
);

module.exports = model("User", UserSchema);
