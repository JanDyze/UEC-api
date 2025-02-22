const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    type_of_event: {
      type: String,
      required: true,
      enum: ["Sunday Service", "Bible Study", "Prayer Meeting", "Other"],
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

module.exports = mongoose.model("Service", ServiceSchema);
