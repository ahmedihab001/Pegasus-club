// src/services/EventService.js
class EventService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  getAllEvents() {
    return this.api.get("/events");
  }

  getEventById(eventId) {
    return this.api.get(`/events/${eventId}`);
  }

  getUserRegistrations(userId) {
    return this.api.get(`/events/user/${userId}/registrations`);
  }

  registerForEvent(eventId, userId, userName) {
    return this.api.post(`/events/${eventId}/register`, { userId, userName });
  }

  cancelRegistration(eventId, userId) {
    return this.api.delete(`/events/${eventId}/register`, { data: { userId } });
  }

  getParticipants(eventId) {
    return this.api.get(`/events/${eventId}/participants`);
  }

  checkRegistrationStatus(eventId, userId) {
    return this.api.get(`/events/${eventId}/check-registration?userId=${userId}`);
  }
  // inside EventService class (add these two methods)

createEvent(eventData) {
  return this.api.post("/events", eventData);
}
updateEvent(eventId, eventData) {
  return this.api.put(`/events/${eventId}`, eventData);
}

deleteEvent(eventId) {
  return this.api.delete(`/events/${eventId}`);
}
}

export default EventService;