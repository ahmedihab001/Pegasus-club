// routes/adminRoutes.js (refactored as a class)
const express = require("express");

class AdminRoutes {
  constructor(adminService) {
    this.adminService = adminService;
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/users", this.getUsers.bind(this));
    this.router.post("/users", this.createUser.bind(this));
    this.router.put("/users/:id", this.updateUser.bind(this));
    this.router.delete("/users/:id", this.deleteUser.bind(this));
  }

  async getUsers(req, res) {
    try {
      const users = await this.adminService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async createUser(req, res) {
    try {
      const user = await this.adminService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      if (err.message === "Email already exists") {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async updateUser(req, res) {
    try {
      const user = await this.adminService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      if (err.message === "User not found") {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await this.adminService.deleteUser(req.params.id);
      res.json(result);
    } catch (err) {
      if (err.message === "User not found") {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }
}

module.exports = AdminRoutes;