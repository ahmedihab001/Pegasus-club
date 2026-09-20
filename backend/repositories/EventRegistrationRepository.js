// repositories/EventRegistrationRepository.js
const EventRegistration = require("../models/EventRegistration");

class EventRegistrationRepository {
  async create(registrationData) {
    return EventRegistration.create(registrationData);
  }

  async findOne(query) {
    return EventRegistration.findOne(query);
  }

  async findOneAndDelete(query) {
    return EventRegistration.findOneAndDelete(query);
  }

  async findByUserId(userId) {
    return EventRegistration.find({ userId }).populate("eventId");
  }

  async findByEventId(eventId) {
    return EventRegistration.find({ eventId }).populate("userId", "name email memberNumber");
  }

  async deleteManyByEventId(eventId) {
    return EventRegistration.deleteMany({ eventId });
  }

  async findByIdWithPopulate(id) {
    return EventRegistration.findById(id).populate("eventId");
  }
}

module.exports = EventRegistrationRepository;