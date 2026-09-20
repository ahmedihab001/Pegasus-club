const { connectDatabase, mongoose } = require("./db");
const Event = require('./models/Event');

async function connect() {
  try {
    await connectDatabase();
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

const events = [
  {
    title: "⚽ Summer Football Tournament",
    description: "5‑a‑side tournament for all age groups. Prizes for winners!",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    location: "Main Stadium",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
    price: 50,
    capacity: 100,
    category: "Football"
  },
  {
    title: "🏊 Swimming Gala",
    description: "Annual swimming competition – freestyle, backstroke, butterfly.",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    location: "Olympic Pool",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635",
    price: 30,
    capacity: 80,
    category: "Swimming"
  },
  {
    title: "💪 Fitness Workshop",
    description: "High‑intensity training session with professional trainers.",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    location: "Gym Hall",
    image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1",
    price: 20,
    capacity: 50,
    category: "Fitness"
  },
  {
    title: "🎉 Club Concert & Gala Dinner",
    description: "Live music, dinner, and dance – celebrate the season with us.",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    location: "Club Garden",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    price: 100,
    capacity: 150,
    category: "Social"
  },
  {
    title: "🎾 Tennis Championship",
    description: "Annual tennis tournament for all skill levels",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    location: "Tennis Courts",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6",
    price: 75,
    capacity: 32,
    category: "Tennis"
  }
];

async function seed() {
  try {
    await connect();
    await Event.deleteMany();
    console.log("🗑️ Deleted old events");
    
    const inserted = await Event.insertMany(events);
    console.log(`✅ Successfully added ${inserted.length} events!`);
    
    inserted.forEach((event, i) => {
      console.log(`${i + 1}. ${event.title} - ${event.price} EGP`);
    });
    
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit();
  }
}

seed();