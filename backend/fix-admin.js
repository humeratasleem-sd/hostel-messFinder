const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config({ path: './.env' });

async function fixAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const email = 'admin123@gmail.com';
  const password = 'admin123';

  // Find if existed
  const admin = await User.findOne({ email, role: 'admin' });
  if (admin) {
    admin.password = password; // this will trigger the pre save hook and hash it correctly since we fixed User.js!
    await admin.save();
    console.log('Updated existing admin user credentials.');
  } else {
    const newAdmin = new User({
      name: 'Super Admin',
      email: email,
      phone: '9999999999',
      password: password, // will be hashed by User.js
      role: 'admin'
    });
    await newAdmin.save();
    console.log('Created new admin user.');
  }

  process.exit(0);
}

fixAdmin();
