// backend/seedFull.js
const { connectDatabase, mongoose } = require("./db");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Program = require("./models/Program");
const ProgramEnrollment = require("./models/ProgramEnrollment");

// -------------------- User Data --------------------
const usersData = [
  {
    name: "Admin User",
    email: "admin@pegasus.com",
    password: "admin123",
    role: "admin",
    memberNumber: "A001",
    workerDetails: {
      shift: "morning",
      department: "administration",
      hireDate: new Date("2020-01-01"),
      salary: 5000,
    },
  },
  {
    name: "John Coach",
    email: "coach@pegasus.com",
    password: "coach123",
    role: "coach",
    memberNumber: "C001",
    workerDetails: {
      shift: "evening",
      department: "coaching",
      hireDate: new Date("2021-06-15"),
      salary: 4000,
    },
  },
  {
    name: "Sarah Trainer",
    email: "sarah@pegasus.com",
    password: "coach123",
    role: "coach",
    memberNumber: "C002",
    workerDetails: {
      shift: "morning",
      department: "coaching",
      hireDate: new Date("2022-03-10"),
      salary: 4200,
    },
  },
  {
    name: "Mike Security",
    email: "security@pegasus.com",
    password: "security123",
    role: "security",
    memberNumber: "S001",
    workerDetails: {
      shift: "night",
      department: "security",
      hireDate: new Date("2021-11-01"),
      salary: 3000,
    },
  },
  {
    name: "Lisa Secretary",
    email: "secretary@pegasus.com",
    password: "secretary123",
    role: "secretary",
    memberNumber: "R001",
    workerDetails: {
      shift: "morning",
      department: "administration",
      hireDate: new Date("2022-01-20"),
      salary: 3500,
    },
  },
  {
    name: "Ahmed Member",
    email: "ahmed@example.com",
    password: "user123",
    role: "user",
    memberNumber: "U001",
  },
  {
    name: "Sara Member",
    email: "sara@example.com",
    password: "user123",
    role: "user",
    memberNumber: "U002",
  },
  {
    name: "Omar Member",
    email: "omar@example.com",
    password: "user123",
    role: "user",
    memberNumber: "U003",
  },
];

// -------------------- Program Data with Images --------------------
const programsData = [
  {
    name: "Advanced Football Training",
    description: "Intensive training for advanced football players",
    duration: "6 weeks",
    price: 200,
    coach: "John Coach",
    schedule: "Mon & Wed 6PM-8PM",
    capacity: 15,
    coachEmail: "coach@pegasus.com",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300&h=200&fit=crop",
  },
  {
    name: "Swimming Technique",
    description: "Learn proper swimming strokes",
    duration: "4 weeks",
    price: 150,
    coach: "Sarah Trainer",
    schedule: "Tue & Thu 5PM-7PM",
    capacity: 12,
    coachEmail: "sarah@pegasus.com",
    image: "https://images.unsplash.com/photo-1600965962109-9d260a717b0a?w=300&h=200&fit=crop",
  },
  {
    name: "Basketball Basics",
    description: "Fundamentals of basketball",
    duration: "8 weeks",
    price: 180,
    coach: "John Coach",
    schedule: "Fri 4PM-6PM",
    capacity: 20,
    coachEmail: "coach@pegasus.com",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop",
  },
];

// -------------------- Enrollment Data (optional) --------------------
const enrollmentsData = [
  { userName: "Ahmed Member", userEmail: "ahmed@example.com", programName: "Advanced Football Training" },
  { userName: "Sara Member", userEmail: "sara@example.com", programName: "Swimming Technique" },
  { userName: "Omar Member", userEmail: "omar@example.com", programName: "Basketball Basics" },
];

// Helper: generate member number for regular users if not provided
async function getNextMemberNumber() {
  const lastUser = await User.findOne({ role: "user" }).sort({ memberNumber: -1 });
  if (!lastUser || !lastUser.memberNumber) return 1;
  return lastUser.memberNumber + 1;
}

async function seedFull() {
  try {
    await connectDatabase();

    // Uncomment to clear existing data (fresh start)
    // await User.deleteMany({});
    // await Program.deleteMany({});
    // await ProgramEnrollment.deleteMany({});
    // console.log("🗑️ Cleared existing users, programs, enrollments");

    const createdUsers = new Map();

    // 1. Create users
    for (const userData of usersData) {
      let memberNumber = userData.memberNumber;
      if (userData.role === "user" && !memberNumber) {
        memberNumber = await getNextMemberNumber();
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const userToCreate = {
        ...userData,
        password: hashedPassword,
        memberNumber,
        createdAt: new Date(),
        membershipEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      };
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`⚠️ User ${userData.email} already exists – skipping`);
        createdUsers.set(userData.email, existing);
      } else {
        const user = await User.create(userToCreate);
        console.log(`✅ Created user: ${user.name} (${user.role})`);
        createdUsers.set(user.email, user);
      }
    }

    // 2. Create programs with images
    for (const progData of programsData) {
      const coach = createdUsers.get(progData.coachEmail);
      if (!coach) {
        console.error(`❌ Coach not found for email: ${progData.coachEmail} – skipping program ${progData.name}`);
        continue;
      }
      const existingProgram = await Program.findOne({ name: progData.name, coachId: coach._id });
      if (existingProgram) {
        console.log(`⚠️ Program "${progData.name}" already exists – skipping`);
        continue;
      }
      const program = await Program.create({
        name: progData.name,
        description: progData.description,
        duration: progData.duration,
        price: progData.price,
        coach: progData.coach,
        coachId: coach._id,
        schedule: progData.schedule,
        capacity: progData.capacity,
        enrolledCount: 0,
        image: progData.image,   // ✅ image added
      });
      console.log(`✅ Created program: ${program.name} (coach: ${program.coach})`);
      createdUsers.set(`program_${progData.name}`, program);
    }

    // 3. Create enrollments
    for (const enroll of enrollmentsData) {
      const user = createdUsers.get(enroll.userEmail);
      const program = createdUsers.get(`program_${enroll.programName}`);
      if (!user || !program) {
        console.log(`⚠️ Could not enroll ${enroll.userName} in ${enroll.programName} – missing user or program`);
        continue;
      }
      const existingEnrollment = await ProgramEnrollment.findOne({ userId: user._id, programId: program._id });
      if (existingEnrollment) {
        console.log(`⚠️ Enrollment already exists for ${user.name} in ${program.name}`);
        continue;
      }
      await ProgramEnrollment.create({
        userId: user._id,
        userName: user.name,
        programId: program._id,
        programName: program.name,
        coach: program.coach,
        duration: program.duration,
        price: program.price,
        schedule: program.schedule,
        enrolledAt: new Date(),
      });
      program.enrolledCount += 1;
      await program.save();
      console.log(`✅ Enrolled ${user.name} into ${program.name}`);
    }

    console.log("🎉 Full seeding with images completed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seedFull();