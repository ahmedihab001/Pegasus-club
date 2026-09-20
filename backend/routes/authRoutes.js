// routes/authRoutes.js (refactored as a class)
const express = require("express");

class AuthRoutes {
  constructor(authService) {
    this.authService = authService;
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post("/signup", this.signup.bind(this));
    this.router.post("/login", this.login.bind(this));
    this.router.post("/forgot-password", this.forgotPassword.bind(this));
    this.router.post("/verify-otp", this.verifyOtp.bind(this));
    this.router.post("/reset-password", this.resetPassword.bind(this));
    this.router.post("/create-admin", this.createAdmin.bind(this));
  }

  async signup(req, res) {
    try {
      const { name, email, password } = req.body;
      const user = await this.authService.signup(name, email, password);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      if (err.message === "Email already exists") {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (err) {
      if (err.message === "Invalid email or password") {
        res.status(401).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);
      res.json(result);
    } catch (err) {
      if (err.message === "No account found with this email") {
        res.status(404).json({ message: err.message });
      } else if (err.message === "Failed to send OTP") {
        res.status(500).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async verifyOtp(req, res) {
    try {
      const { email, otp } = req.body;
      const result = await this.authService.verifyOtp(email, otp);
      res.json(result);
    } catch (err) {
      if (err.message === "User not found") {
        res.status(404).json({ message: err.message });
      } else if (err.message === "Invalid OTP" || err.message === "OTP expired") {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await this.authService.resetPassword(email, otp, newPassword);
      res.json(result);
    } catch (err) {
      if (err.message === "User not found") {
        res.status(404).json({ message: err.message });
      } else if (err.message === "Invalid OTP" || err.message === "OTP expired") {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }

  async createAdmin(req, res) {
    try {
      const result = await this.authService.createAdmin();
      res.json(result);
    } catch (err) {
      if (err.message === "Admin already exists") {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }
}

module.exports = AuthRoutes;