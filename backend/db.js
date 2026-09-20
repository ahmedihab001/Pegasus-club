const mongoose = require("mongoose");
require("dotenv").config();

const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017/task4";
const DEFAULT_OPTIONS = {
  serverSelectionTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function connectDatabase() {
  const uri = process.env.MONGO_URI;

  if (uri) {
    try {
      await mongoose.connect(uri, DEFAULT_OPTIONS);
      console.log("✅ Connected to MongoDB using MONGO_URI");
      return;
    } catch (err) {
      console.warn("⚠️ Failed to connect with MONGO_URI:", err.message);
    }
  } else {
    console.warn("⚠️ MONGO_URI not set. Trying local MongoDB.");
  }

  try {
    await mongoose.connect(DEFAULT_LOCAL_URI, DEFAULT_OPTIONS);
    console.log("✅ Connected to local MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect to local MongoDB:", err.message);
    throw err;
  }
}

module.exports = { connectDatabase, mongoose };
