const mongoose = require("mongoose");

const PersonSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    address: { type: String, default: null },
    birthday: { type: Date, default: null },
    is_member: { type: Boolean, default: false },
    gender: { type: String, enum: ["Male", "Female"], default: null }, // Nullable
    nickname: { type: String, default: null },
    phone: { type: String, default: null },
    facebook: { type: String, default: null },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

module.exports = mongoose.model("Person", PersonSchema);
