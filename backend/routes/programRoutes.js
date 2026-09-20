// routes/programRoutes.js (refactored as a class)
const express = require("express");

class ProgramRoutes {
  constructor(programService) {
    this.programService = programService;
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/", this.getAllPrograms.bind(this));
    this.router.get("/:id", this.getProgramById.bind(this));
    this.router.post("/", this.createProgram.bind(this));
    this.router.put("/:id", this.updateProgram.bind(this));
    this.router.delete("/:id", this.deleteProgram.bind(this));
    this.router.post("/:id/enroll", this.enrollUser.bind(this));
    this.router.delete("/:id/enroll", this.cancelEnrollment.bind(this));
    this.router.get("/user/:userId/enrollments", this.getUserEnrollments.bind(this));
    this.router.get("/:id/check-enrollment", this.checkEnrollment.bind(this));
  }

  async getAllPrograms(req, res) {
    try {
      const programs = await this.programService.getAllPrograms();
      res.json(programs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getProgramById(req, res) {
    try {
      const program = await this.programService.getProgramById(req.params.id);
      res.json(program);
    } catch (err) {
      if (err.message === "Program not found") {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async createProgram(req, res) {
    try {
      const program = await this.programService.createProgram(req.body);
      res.status(201).json(program);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateProgram(req, res) {
    try {
      const updated = await this.programService.updateProgram(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      if (err.message === "Program not found") {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async deleteProgram(req, res) {
    try {
      const result = await this.programService.deleteProgram(req.params.id);
      res.json(result);
    } catch (err) {
      if (err.message === "Program not found") {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async enrollUser(req, res) {
    try {
      const { userId, userName } = req.body;
      const result = await this.programService.enrollUser(userId, userName, req.params.id);
      res.status(201).json(result);
    } catch (err) {
      if (err.message === "Program not found" || err.message === "You are already enrolled in this program!" || err.message === "Program is full!") {
        res.status(400).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: err.message });
      }
    }
  }

  async cancelEnrollment(req, res) {
    try {
      const { userId } = req.body;
      const result = await this.programService.cancelEnrollment(userId, req.params.id);
      res.json(result);
    } catch (err) {
      if (err.message === "Enrollment not found") {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async getUserEnrollments(req, res) {
    try {
      const enrollments = await this.programService.getUserEnrollments(req.params.userId);
      res.json(enrollments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async checkEnrollment(req, res) {
    try {
      const { userId } = req.query;
      const result = await this.programService.checkEnrollment(userId, req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = ProgramRoutes;