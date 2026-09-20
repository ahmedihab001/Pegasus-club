// backend/addProgramImages.js
const { connectDatabase, mongoose } = require("./db");
require("dotenv").config();
const Program = require("./models/Program");

const imageMap = {
  "Advanced Football Training": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300&h=200&fit=crop",
  "Swimming Technique": "https://images.unsplash.com/photo-1600965962109-9d260a717b0a?w=300&h=200&fit=crop",
  "Basketball Basics": "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop",
};

async function addImages() {
  await connectDatabase();
  for (const [name, url] of Object.entries(imageMap)) {
    const result = await Program.updateOne({ name }, { $set: { image: url } });
    if (result.modifiedCount) console.log(`✅ Updated image for ${name}`);
    else console.log(`⚠️ Program "${name}" not found or image already set`);
  }
  await mongoose.disconnect();
  process.exit();
}
addImages();