// src/services/BookingService.js
class BookingService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  getUserBookings(userId) {
    return this.api.get(`/bookings?userId=${userId}`);
  }

  createBooking(bookingData) {
    return this.api.post("/bookings", bookingData);
  }

  cancelBooking(bookingId) {
    return this.api.delete(`/bookings/${bookingId}`);
  }

  getSlotCount(sportId, coach, day, time) {
    return this.api.get(`/bookings/count?sportId=${sportId}&coach=${coach}&day=${day}&time=${time}`);
  }

  checkDuplicate(userId, sportId, coach, day, time) {
    return this.api.get(`/bookings/check-duplicate?userId=${userId}&sportId=${sportId}&coach=${coach}&day=${day}&time=${time}`);
  }
}

export default BookingService;