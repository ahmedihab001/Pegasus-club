const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  registeredAt: { type: Date, default: Date.now },
  status: { type: String, default: "confirmed" } // confirmed, cancelled
});

// Prevent duplicate registrations (one user per event)
eventRegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);
