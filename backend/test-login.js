const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env' });

async function debugLogin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const email = 'admin123@gmail.com';
  const password = 'admin123';

  console.log('Searching for admin:', email);
  const admin = await User.findOne({ email }).select('+password');
  console.log('Admin found?', !!admin);

  if (admin) {
    console.log('Admin role:', admin.role);
    console.log('Admin password hash in DB:', admin.password);
    
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('bcrypt.compare result:', isMatch);
    
    // Test matchPassword method
    const methodMatch = await admin.matchPassword(password);
    console.log('matchPassword method result:', methodMatch);
  }

  process.exit(0);
}

debugLogin();
