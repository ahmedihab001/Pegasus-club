// server.js (full corrected version)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoMemoryServer } = require("mongodb-memory-server");
const UserRepository = require("./repositories/UserRepository");
const AuthService = require("./services/AuthService");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const mongoURI = process.env.MONGO_URI || null;

async function connectDatabase() {
  if (mongoURI) {
    try {
      await mongoose.connect(mongoURI, { dbName: process.env.DB_NAME || undefined });
      console.log("✅ DB Connected to Atlas");
      return;
    } catch (err) {
      console.warn("⚠️ Atlas connection failed:", err.message);
      console.warn("⚠️ Falling back to in-memory MongoDB");
    }
  } else {
    console.warn("⚠️ No MONGO_URI configured. Using in-memory MongoDB.");
  }

  const mongoServer = await MongoMemoryServer.create();
  const localUri = mongoServer.getUri();
  await mongoose.connect(localUri);
  console.log("✅ DB Connected to in-memory MongoDB");
}

async function createDefaultAdmin() {
  const existingAdmin = await userRepository.findOne({ role: "admin" });
  if (!existingAdmin) {
    try {
      await authService.createAdmin();
      console.log("✅ Default admin user created: admin@pegasus.com / admin123");
    } catch (err) {
      console.warn("⚠️ Could not create default admin:", err.message);
    }
  }
}

// Import middleware
const { authMiddleware, adminMiddleware } = require("./middleware/auth");

// Import routes from container
const { 
  bookingRoutes, 
  eventRoutes, 
  programRoutes, 
  authRoutes, 
  adminRoutes,
  sportRoutes,
  workerRoutes,
  coachRoutes
} = require("./container");

// Public routes (no auth)
app.use("/api/auth", authRoutes.router);
app.use("/api/sports", sportRoutes.router);
app.use("/api/events", eventRoutes.router);
app.use("/api/programs", programRoutes.router);

// Protected routes (require authentication)
app.use("/api/bookings", authMiddleware, bookingRoutes.router);
app.use("/api/admin", authMiddleware, adminMiddleware, adminRoutes.router);
app.use("/api/workers", authMiddleware, adminMiddleware, workerRoutes.router);
app.use("/api/coach", authMiddleware, coachRoutes.router);

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDatabase();
  await createDefaultAdmin();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error("Fatal server startup error:", err);
    process.exit(1);
  });
}

module.exports = app;