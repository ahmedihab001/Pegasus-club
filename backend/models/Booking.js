const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  sportId: { type: String, required: true },
  sportName: { type: String, required: true },
  coach: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  price: { type: Number, default: 0 },
  status: { type: String, default: "confirmed" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);