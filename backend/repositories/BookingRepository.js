// repositories/BookingRepository.js
const Booking = require("../models/Booking");

class BookingRepository {
  async findByUserId(userId) {
    return Booking.find({ userId });
  }

  async create(bookingData) {
    return Booking.create(bookingData);
  }

  async findOne(query) {
    return Booking.findOne(query);
  }

  async countDocuments(query) {
    return Booking.countDocuments(query);
  }

  async findByIdAndDelete(id) {
    return Booking.findByIdAndDelete(id);
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    return Booking.findByIdAndUpdate(id, update, options);
  }
  // Add to BookingRepository class:

async deleteManyByUserId(userId) {
  return Booking.deleteMany({ userId });
}
}

module.exports = BookingRepository;