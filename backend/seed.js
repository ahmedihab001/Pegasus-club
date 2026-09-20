const { connectDatabase, mongoose } = require("./db");
const Event = require("./models/Event");
const Sport = require("./models/Sport");
const Program = require("./models/Program");

async function connect() {
  try {
    await connectDatabase();
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
}

// ==================== البيانات ====================

// 1. الأحداث (Events)
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

// 2. الرياضات (Sports) - نسخة مبسطة بدون coaches (عشان تظهر بسرعة)
const sports = [
  {
    name: "⚽ Football",
    description: "Professional football training with expert coaches.",
    price: 100,
    image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=2070",
    category: "Team Sport",
    capacity: 30,
    coaches: []
  },
  {
    name: "🏊 Swimming",
    description: "Professional swimming lessons in Olympic-sized pool.",
    price: 150,
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070",
    category: "Water Sport",
    capacity: 20,
    coaches: []
  },
  {
    name: "💪 Gym",
    description: "State-of-the-art equipment and personal training.",
    price: 200,
    image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=2070",
    category: "Fitness",
    capacity: 50,
    coaches: []
  },
  {
    name: "🎾 Tennis",
    description: "Professional tennis coaching for all skill levels.",
    price: 180,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2070",
    category: "Racket Sport",
    capacity: 16,
    coaches: []
  },
  {
    name: "🏀 Basketball",
    description: "Learn basketball fundamentals and team play.",
    price: 120,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2070",
    category: "Team Sport",
    capacity: 24,
    coaches: []
  },
  {
    name: "🧘 Yoga",
    description: "Find inner peace with certified yoga instructors.",
    price: 80,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2070",
    category: "Wellness",
    capacity: 20,
    coaches: []
  }
];

// 3. البرامج (Programs)
const programs = [
  {
    name: "🏃 Personal Training",
    description: "One-on-one training with expert coaches",
    duration: "1 hour",
    price: 200
  },
  {
    name: "👥 Group Classes",
    description: "Fun and energetic group workouts",
    duration: "45 minutes",
    price: 100
  },
  {
    name: "🏊 Swimming Lessons",
    description: "Learn swimming from beginners to advanced",
    duration: "1 hour",
    price: 150
  },
  {
    name: "⚽ Football Academy",
    description: "Professional football training",
    duration: "1.5 hours",
    price: 180
  },
  {
    name: "🧘 Yoga Sessions",
    description: "Mind & body wellness",
    duration: "1 hour",
    price: 120
  },
  {
    name: "🎾 Tennis Coaching",
    description: "Professional tennis lessons",
    duration: "1 hour",
    price: 160
  },
  {
    name: "🏀 Basketball Training",
    description: "Learn basketball fundamentals",
    duration: "1.5 hours",
    price: 140
  }
];

// ==================== دالة الإضافة ====================

async function seed() {
  try {
    // حذف البيانات القديمة
    await Event.deleteMany();
    await Sport.deleteMany();
    await Program.deleteMany();
    console.log("🗑️ Deleted old data (events, sports, programs)");
    
    // إضافة البيانات الجديدة
    const insertedEvents = await Event.insertMany(events);
    const insertedSports = await Sport.insertMany(sports);
    const insertedPrograms = await Program.insertMany(programs);
    
    console.log("\n📋 EVENTS:");
    console.log(`✅ Added ${insertedEvents.length} events!`);
    insertedEvents.forEach((event, i) => {
      console.log(`${i + 1}. ${event.title} - ${event.price} EGP`);
    });
    
    console.log("\n📋 SPORTS:");
    console.log(`✅ Added ${insertedSports.length} sports!`);
    insertedSports.forEach((sport, i) => {
      console.log(`${i + 1}. ${sport.name} - ${sport.price} EGP`);
    });
    
    console.log("\n📋 PROGRAMS:");
    console.log(`✅ Added ${insertedPrograms.length} programs!`);
    insertedPrograms.forEach((program, i) => {
      console.log(`${i + 1}. ${program.name} - ${program.price} EGP`);
    });
    
    console.log("\n🔥 Seed Done Successfully!");
    process.exit();
  } catch (err) {
    console.log("❌ Seed Error:", err);
    process.exit(1);
  }
}

// تشغيل الـ seed
(async () => {
  await connect();
  await seed();
})();