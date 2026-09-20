// services/BookingService.js
class BookingService {
  // Constructor injection – the injector will provide the repository
  constructor(bookingRepository) {
    this.bookingRepo = bookingRepository;
  }

  async getUserBookings(userId) {
    if (!userId) throw new Error("userId is required");
    return this.bookingRepo.findByUserId(userId);
  }

  async getSlotCount(sportId, coach, day, time) {
    if (!sportId || !coach || !day || !time) {
      throw new Error("Missing required fields for counting");
    }
    return this.bookingRepo.countDocuments({
      sportId: String(sportId),
      coach,
      day,
      time,
      status: "confirmed"
    });
  }

  async createBooking(bookingData) {
    const { userId, sportId, coach, day, time, sportName, price, status } = bookingData;
    
    // Validate required fields
    if (!userId || !sportId || !sportName || !coach || !day || !time) {
      throw new Error("Missing required fields");
    }

    // Duplicate check
    const existing = await this.bookingRepo.findOne({
      userId: String(userId),
      sportId: String(sportId),
      coach,
      day,
      time,
      status: "confirmed"
    });

    if (existing) {
      throw new Error("You already have a booking for this slot! You cannot book the same session twice.");
    }

    // Create booking
    return this.bookingRepo.create({
      userId: String(userId),
      sportId: String(sportId),
      sportName,
      coach,
      day,
      time,
      price: price || 0,
      status: status || "confirmed"
    });
  }

  async cancelBooking(bookingId) {
    const deleted = await this.bookingRepo.findByIdAndDelete(bookingId);
    if (!deleted) throw new Error("Booking not found");
    return { message: "Booking cancelled successfully" };
  }

  async updateBookingStatus(bookingId, status) {
    const updated = await this.bookingRepo.findByIdAndUpdate(bookingId, { status });
    if (!updated) throw new Error("Booking not found");
    return updated;
  }

  async checkDuplicate(userId, sportId, coach, day, time) {
    const existing = await this.bookingRepo.findOne({
      userId: String(userId),
      sportId: String(sportId),
      coach,
      day,
      time,
      status: "confirmed"
    });
    return { exists: !!existing };
  }
}

module.exports = BookingService;