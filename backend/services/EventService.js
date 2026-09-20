// services/EventService.js
class EventService {
  constructor(eventRepository, registrationRepository) {
    this.eventRepo = eventRepository;
    this.regRepo = registrationRepository;
  }

  async getAllEvents() {
    return this.eventRepo.findAll();
  }

  async getEventById(id) {
    const event = await this.eventRepo.findById(id);
    if (!event) throw new Error("Event not found");
    return event;
  }

  async createEvent(eventData) {
    return this.eventRepo.create(eventData);
  }

  async updateEvent(id, updateData) {
    const updated = await this.eventRepo.update(id, updateData);
    if (!updated) throw new Error("Event not found");
    return updated;
  }

  async deleteEvent(id) {
    const event = await this.eventRepo.deleteById(id);
    if (!event) throw new Error("Event not found");
    // Cascade delete registrations
    await this.regRepo.deleteManyByEventId(id);
    return { message: "Event deleted" };
  }

  async registerUserForEvent(userId, eventId) {
    if (!userId) throw new Error("userId is required");

    const event = await this.eventRepo.findById(eventId);
    if (!event) throw new Error("Event not found");

    // Check for duplicate registration
    const existing = await this.regRepo.findOne({ userId, eventId });
    if (existing) {
      throw new Error("You have already registered for this event!");
    }

    // Optional: capacity check
    const registrationsCount = await this.regRepo.findByEventId(eventId);
    if (event.capacity && registrationsCount.length >= event.capacity) {
      throw new Error("Event is full");
    }

    const registration = await this.regRepo.create({ userId, eventId, status: "confirmed" });
    const populated = await this.regRepo.findByIdWithPopulate(registration._id);

    return {
      message: "Successfully registered for event!",
      registration: {
        id: registration._id,
        userId: registration.userId,
        eventId: registration.eventId,
        eventTitle: populated.eventId.title,
        eventDate: populated.eventId.date,
        eventLocation: populated.eventId.location,
        eventPrice: populated.eventId.price,
        registeredAt: registration.registeredAt,
        status: registration.status
      }
    };
  }

  async cancelRegistration(userId, eventId) {
    if (!userId) throw new Error("userId is required");

    const result = await this.regRepo.findOneAndDelete({ userId, eventId });
    if (!result) throw new Error("Registration not found");

    return { message: "Registration cancelled successfully" };
  }

  async getUserRegistrations(userId) {
    const registrations = await this.regRepo.findByUserId(userId);
    return registrations.map(reg => ({
      id: reg._id,
      userId: reg.userId,
      eventId: reg.eventId._id,
      eventTitle: reg.eventId.title,
      eventDate: reg.eventId.date,
      eventLocation: reg.eventId.location,
      eventPrice: reg.eventId.price,
      registeredAt: reg.registeredAt,
      status: reg.status
    }));
  }

  async getEventParticipants(eventId) {
    const registrations = await this.regRepo.findByEventId(eventId);
    return registrations.map(reg => ({
      _id: reg.userId._id,
      name: reg.userId.name,
      email: reg.userId.email,
      memberNumber: reg.userId.memberNumber,
      registeredAt: reg.registeredAt,
      status: reg.status
    }));
  }

  async checkRegistrationStatus(userId, eventId) {
    if (!userId) throw new Error("userId query param required");
    const registration = await this.regRepo.findOne({ userId, eventId });
    return {
      registered: !!registration,
      registration: registration ? {
        id: registration._id,
        registeredAt: registration.registeredAt,
        status: registration.status
      } : null
    };
  }
}

module.exports = EventService;