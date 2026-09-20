// backend/routes/workerRoutes.js
const express = require("express");

class WorkerRoutes {
  constructor(workerService) {
    this.workerService = workerService;
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/", this.getWorkers.bind(this));
    this.router.put("/:userId/role", this.updateRole.bind(this));
  }

  async getWorkers(req, res) {
    try {
      const { role } = req.query;
      const workers = await this.workerService.getWorkersByRole(role || "all");
      res.json(workers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      const updated = await this.workerService.updateUserRole(userId, role);
      res.json(updated);
    } catch (err) {
      if (err.message === "User not found") {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }
}

module.exports = WorkerRoutes;