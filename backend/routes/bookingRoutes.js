// routes/bookingRoutes.js (refactored as a class)
const express = require("express");

class BookingRoutes {
  // Constructor injection – service is provided by the injector
  constructor(bookingService) {
    this.bookingService = bookingService;
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/", this.getBookings.bind(this));
    this.router.post("/", this.createBooking.bind(this));
    this.router.get("/count", this.getSlotCount.bind(this));
    this.router.delete("/:id", this.cancelBooking.bind(this));
    this.router.put("/:id", this.updateBooking.bind(this));
    this.router.get("/check-duplicate", this.checkDuplicate.bind(this));
  }

  async getBookings(req, res) {
    try {
      const userId = req.query.userId;
      const bookings = await this.bookingService.getUserBookings(userId);
      res.json(bookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      res.status(400).json({ message: err.message });
    }
  }

  async createBooking(req, res) {
    try {
      const booking = await this.bookingService.createBooking(req.body);
      res.status(201).json(booking);
    } catch (err) {
      console.error("Error creating booking:", err);
      res.status(400).json({ message: err.message });
    }
  }

  async getSlotCount(req, res) {
    try {
      const { sportId, coach, day, time } = req.query;
      const count = await this.bookingService.getSlotCount(sportId, coach, day, time);
      res.json({ count });
    } catch (err) {
      console.error("Error counting slots:", err);
      res.status(400).json({ message: err.message });
    }
  }

  async cancelBooking(req, res) {
    try {
      const result = await this.bookingService.cancelBooking(req.params.id);
      res.json({ 
        message: "Booking cancelled successfully. You can now book another session.",
        ...result 
      });
    } catch (err) {
      console.error("Error cancelling booking:", err);
      res.status(404).json({ message: err.message });
    }
  }

  async updateBooking(req, res) {
    try {
      const { status } = req.body;
      const updated = await this.bookingService.updateBookingStatus(req.params.id, status);
      res.json(updated);
    } catch (err) {
      console.error("Error updating booking:", err);
      res.status(404).json({ message: err.message });
    }
  }

  async checkDuplicate(req, res) {
    try {
      const { userId, sportId, coach, day, time } = req.query;
      const result = await this.bookingService.checkDuplicate(userId, sportId, coach, day, time);
      res.json(result);
    } catch (err) {
      console.error("Error checking duplicate:", err);
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = BookingRoutes;