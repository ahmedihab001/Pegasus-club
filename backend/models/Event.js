const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  image: String,
  price: { type: Number, default: 0 },
  capacity: { type: Number, default: 100 },  // ✅ أضف هذا السطر
  category: { type: String, default: "General" }, // ✅ اختياري
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);