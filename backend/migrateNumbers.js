const { connectDatabase, mongoose } = require('./db');
const User = require('./models/User');

async function connect() {
  try {
    await connectDatabase();
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

async function run() {
  await connect();

  const allUsers = await User.find().sort({ createdAt: 1 });

  let userCounter = 1;
  let adminCounter = 1;

  for (const user of allUsers) {
    if (user.role === 'admin') {
      const adminNum = adminCounter < 10 ? `0${adminCounter}` : `${adminCounter}`;
      user.memberNumber = adminNum;
      adminCounter++;
    } else {
      user.memberNumber = userCounter;
      userCounter++;
    }
    await user.save();
  }

  console.log(`✅ Reset ${userCounter - 1} users and ${adminCounter - 1} admins`);
  await mongoose.disconnect();
  process.exit();
}

run();