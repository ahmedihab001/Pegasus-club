// backend/assignCoachId.js
const { connectDatabase, mongoose } = require("./db");
require("dotenv").config();
const Program = require("./models/Program");
const User = require("./models/User");

async function assign() {
  await connectDatabase();
  const coach = await User.findOne({ role: "coach" });
  if (coach) {
    await Program.updateMany({}, { coachId: coach._id });
    console.log(`Assigned coachId ${coach._id} to all programs`);
  }
  await mongoose.disconnect();
  process.exit();
}
assign();