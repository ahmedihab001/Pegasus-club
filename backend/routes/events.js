// routes/events.js (refactored as a class)
const express = require("express");

class EventRoutes {
  constructor(eventService) {
    this.eventService = eventService;
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/", this.getAllEvents.bind(this));
    this.router.get("/:id", this.getEventById.bind(this));
    this.router.post("/", this.createEvent.bind(this));
    this.router.put("/:id", this.updateEvent.bind(this));     // optional – add if needed
    this.router.delete("/:id", this.deleteEvent.bind(this));
    this.router.post("/:id/register", this.registerUser.bind(this));
    this.router.delete("/:id/register", this.cancelRegistration.bind(this));
    this.router.get("/user/:userId/registrations", this.getUserRegistrations.bind(this));
    this.router.get("/:id/participants", this.getParticipants.bind(this));
    this.router.get("/:id/check-registration", this.checkRegistration.bind(this));
  }

  async getAllEvents(req, res) {
    try {
      const events = await this.eventService.getAllEvents();
      res.json(events);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getEventById(req, res) {
    try {
      const event = await this.eventService.getEventById(req.params.id);
      res.json(event);
    } catch (err) {
      if (err.message === "Event not found") {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async createEvent(req, res) {
    try {
      const event = await this.eventService.createEvent(req.body);
      res.status(201).json(event);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateEvent(req, res) {
    try {
      const updated = await this.eventService.updateEvent(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      if (err.message === "Event not found") {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async deleteEvent(req, res) {
    try {
      const result = await this.eventService.deleteEvent(req.params.id);
      res.json(result);
    } catch (err) {
      if (err.message === "Event not found") {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async registerUser(req, res) {
    try {
      const { userId } = req.body;
      const result = await this.eventService.registerUserForEvent(userId, req.params.id);
      res.status(201).json(result);
    } catch (err) {
      if (err.message.includes("already registered") || err.message === "Event not found") {
        res.status(400).json({ message: err.message });
      } else if (err.message === "Event is full") {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: err.message });
      }
    }
  }

  async cancelRegistration(req, res) {
    try {
      const { userId } = req.body;
      const result = await this.eventService.cancelRegistration(userId, req.params.id);
      res.json(result);
    } catch (err) {
      if (err.message === "Registration not found") {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async getUserRegistrations(req, res) {
    try {
      const registrations = await this.eventService.getUserRegistrations(req.params.userId);
      res.json(registrations);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }

  async getParticipants(req, res) {
    try {
      const participants = await this.eventService.getEventParticipants(req.params.id);
      res.json(participants);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async checkRegistration(req, res) {
    try {
      const { userId } = req.query;
      const result = await this.eventService.checkRegistrationStatus(userId, req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = EventRoutes;