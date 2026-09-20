// routes/sportRoutes.js (refactored as a class)
const express = require("express");

class SportRoutes {
  constructor(sportService) {
    this.sportService = sportService;
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/", this.getAllSports.bind(this));
    this.router.get("/:id", this.getSportById.bind(this));
    this.router.post("/", this.createSport.bind(this));
    this.router.put("/:id", this.updateSport.bind(this));
    this.router.delete("/:id", this.deleteSport.bind(this));
    this.router.post("/:id/coaches", this.addCoach.bind(this));
  }

  async getAllSports(req, res) {
    try {
      const sports = await this.sportService.getAllSports();
      res.json(sports);
    } catch (err) {
      console.error("GET /api/sports error:", err);
      res.status(500).json({ message: err.message });
    }
  }

  async getSportById(req, res) {
    try {
      const sport = await this.sportService.getSportById(req.params.id);
      res.json(sport);
    } catch (err) {
      console.error("GET /api/sports/:id error:", err);
      if (err.message === "Sport not found") {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async createSport(req, res) {
    try {
      const savedSport = await this.sportService.createSport(req.body);
      res.status(201).json(savedSport);
    } catch (err) {
      console.error("POST /api/sports error:", err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message, details: err.errors });
      }
      res.status(500).json({ message: err.message });
    }
  }

  async updateSport(req, res) {
    try {
      const updatedSport = await this.sportService.updateSport(req.params.id, req.body);
      res.json(updatedSport);
    } catch (err) {
      console.error("PUT /api/sports/:id error:", err);
      if (err.message === "Sport not found") {
        return res.status(404).json({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message, details: err.errors });
      }
      res.status(500).json({ message: err.message });
    }
  }

  async deleteSport(req, res) {
    try {
      const result = await this.sportService.deleteSport(req.params.id);
      res.json(result);
    } catch (err) {
      console.error("DELETE /api/sports/:id error:", err);
      if (err.message === "Sport not found") {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ message: err.message });
    }
  }

  async addCoach(req, res) {
    try {
      const sport = await this.sportService.addCoachToSport(req.params.id, req.body);
      res.json(sport);
    } catch (err) {
      console.error("POST /api/sports/:id/coaches error:", err);
      if (err.message === "Sport not found") {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = SportRoutes;