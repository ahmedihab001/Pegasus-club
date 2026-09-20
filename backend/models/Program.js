const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
coach: { type: String, default: "Professional Coach" },
coachId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  schedule: { type: String, default: "Flexible" },  // ✅ الجدول الزمني
  capacity: { type: Number, default: 20 },
  enrolledCount: { type: Number, default: 0 },  // ✅ عدد المشتركين
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Program", programSchema);