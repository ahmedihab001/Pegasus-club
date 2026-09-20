const express = require("express");

class CoachRoutes {
  constructor(coachService) {
    this.coachService = coachService;
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/programs", this.getMyPrograms.bind(this));
    this.router.post("/programs", this.createProgram.bind(this));
    this.router.get("/programs/:programId/enrollments", this.getEnrollments.bind(this));
    this.router.put("/programs/:programId", this.updateProgram.bind(this));
    this.router.delete("/programs/:programId", this.deleteProgram.bind(this));
  }

  async getMyPrograms(req, res) {
    try {
      const coachId = req.user.id;
      const programs = await this.coachService.getMyPrograms(coachId);
      res.json(programs);
    } catch (err) {
      console.error("GET /coach/programs error:", err);
      res.status(500).json({ message: err.message, stack: err.stack });
    }
  }

  async createProgram(req, res) {
    try {
      const coachId = req.user.id;
      const coachName = req.user.name;
      const program = await this.coachService.createProgram(coachId, req.body, coachName);
      res.status(201).json(program);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getEnrollments(req, res) {
    try {
      const coachId = req.user.id;
      const { programId } = req.params;
      const enrollments = await this.coachService.getEnrollmentsForProgram(programId, coachId);
      res.json(enrollments);
    } catch (err) {
      if (err.message === "Unauthorized") return res.status(403).json({ message: err.message });
      res.status(500).json({ message: err.message });
    }
  }

  async updateProgram(req, res) {
    try {
      const coachId = req.user.id;
      const { programId } = req.params;
      const updated = await this.coachService.updateMyProgram(programId, coachId, req.body);
      res.json(updated);
    } catch (err) {
      if (err.message === "Unauthorized") return res.status(403).json({ message: err.message });
      res.status(500).json({ message: err.message });
    }
  }

  async deleteProgram(req, res) {
    try {
      const coachId = req.user.id;
      const { programId } = req.params;
      await this.coachService.deleteMyProgram(programId, coachId);
      res.json({ message: "Program deleted" });
    } catch (err) {
      if (err.message === "Unauthorized") return res.status(403).json({ message: err.message });
      res.status(500).json({ message: err.message });
    }
  }
}
module.exports = CoachRoutes;