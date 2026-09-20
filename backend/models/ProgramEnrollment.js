// models/ProgramEnrollment.js
const mongoose = require("mongoose");

const programEnrollmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: "Program", required: true },
  programName: { type: String },
  coach: { type: String },
  duration: { type: String },
  price: { type: Number },
  schedule: { type: String },
  enrolledAt: { type: Date, default: Date.now },
  status: { type: String, default: "active" }
});

// Prevent duplicate enrollment (one user per program)
programEnrollmentSchema.index({ userId: 1, programId: 1 }, { unique: true });

module.exports = mongoose.model("ProgramEnrollment", programEnrollmentSchema);