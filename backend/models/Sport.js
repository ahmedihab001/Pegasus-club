const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  times: [{ type: String, required: true }]
});

const coachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  schedule: [scheduleSchema]
});

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  image: { type: String, default: "" },
  coaches: [coachSchema],
  category: { type: String, default: "General" },
  capacity: { type: Number, default: 50 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

sportSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Sport", sportSchema);