// repositories/EventRepository.js
const Event = require("../models/Event");

class EventRepository {
  async findAll() {
    return Event.find().sort({ date: 1 });
  }

  async findById(id) {
    return Event.findById(id);
  }

  async create(eventData) {
    const event = new Event(eventData);
    return event.save();
  }

  async update(id, updateData) {
    return Event.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return Event.findByIdAndDelete(id);
  }
}

module.exports = EventRepository;