const router = require("express").Router();
const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");

// GET all events (sorted by date)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new event (admin only – frontend protected)
router.post("/", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update event
router.put("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE event
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register user for an event
router.post("/:id/register", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const existing = await EventRegistration.findOne({ userId, eventId: req.params.id });
    if (existing) return res.status(400).json({ message: "Already registered" });

    const registration = await EventRegistration.create({ userId, eventId: req.params.id });
    res.status(201).json(registration);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Already registered" });
    res.status(500).json({ message: err.message });
  }
});

// Cancel registration
router.delete("/:id/register", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const result = await EventRegistration.findOneAndDelete({ userId, eventId: req.params.id });
    if (!result) return res.status(404).json({ message: "Registration not found" });
    res.json({ message: "Registration cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get participants for an event (admin)
router.get("/:id/participants", async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ eventId: req.params.id }).populate("userId", "name email memberNumber");
    res.json(registrations.map(r => r.userId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get events a user has joined (fixed: always returns array)
router.get("/user/:userId/registrations", async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ userId: req.params.userId }).populate("eventId");
    // Always return an array (filter out any null events)
    const events = registrations.map(r => r.eventId).filter(e => e);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.json([]); // returns empty array on error
  }
});

module.exports = router;