const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
role: {
  type: String,
  default: "user",
  enum: ["user", "admin", "coach", "security", "secretary"]
},  memberNumber: { type: mongoose.Schema.Types.Mixed, unique: true }, // ← changed to Mixed
  joinedPrograms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Program" }],
  createdAt: { type: Date, default: Date.now },
  membershipEndDate: { type: Date },
  resetOTP: { type: String },
  resetOTPExpiry: { type: Date },
  workerDetails: {
  shift: { type: String, enum: ["morning", "evening", "night"], default: null },
  department: { type: String, enum: ["security", "coaching", "administration"], default: null },
  hireDate: { type: Date, default: null },
  salary: { type: Number, default: null },
}
});

module.exports = mongoose.model("User", userSchema);