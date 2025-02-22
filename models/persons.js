const mongoose = require("mongoose");
const Attendance = require("./attendance");

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

PersonSchema.pre("findOneAndDelete", async function (next) {
  const person = await this.model.findOne(this.getQuery());

  if (person) {
    await Attendance.deleteMany({ person_id: person._id });
    console.log(`Deleted attendance records for person ${person._id}`);
  }

  next();
});

module.exports = mongoose.model("Person", PersonSchema);
