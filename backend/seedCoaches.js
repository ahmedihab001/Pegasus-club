const { connectDatabase, mongoose } = require("./db");
const Coach = require("./models/Coach");

async function connect() {
  try {
    await connectDatabase();
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

const data = [
  {
    name:"Ahmed Ali",
    sport:"Football",
    image:"https://images.unsplash.com/photo-1521412644187",
    slots:[
      {time:"5:00 PM", available:true},
      {time:"6:00 PM", available:true},
      {time:"7:00 PM", available:false}
    ]
  },
  {
    name:"Omar Hassan",
    sport:"Swimming",
    image:"https://images.unsplash.com/photo-1530549387789",
    slots:[
      {time:"4:00 PM", available:true},
      {time:"5:30 PM", available:true}
    ]
  }
];

async function run(){
  await connect();
  await Coach.deleteMany();
  await Coach.insertMany(data);
  console.log("Coaches Seeded");
} 

run().finally(async () => {
  await mongoose.disconnect();
  process.exit();
});
