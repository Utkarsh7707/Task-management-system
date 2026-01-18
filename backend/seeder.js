const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); 
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const importData = async () => {
  try {
    // 1. Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });

    if (adminExists) {
      console.log('Admin already exists!');
      process.exit();
    }

    // 2. Create the Admin User
    // Note: We use the User model which has the pre-save hook to hash passwords automatically
    const adminUser = new User({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed by your User model logic
      role: 'admin',
    });

    await adminUser.save();

    console.log('Admin User Created Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();