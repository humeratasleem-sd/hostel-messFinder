const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://Testuser:Naseem996@cluster0.zewmraj.mongodb.net/Hostel_Mess_Finder';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ MongoDB Connected Successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
