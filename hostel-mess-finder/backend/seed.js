const mongoose = require('mongoose');
const Mess = require('./models/Mess');
const User = require('./models/User');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel-mess-finder');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const sampleMesses = [
    {
        name: "Golden Fork Mess",
        location: "Near DU Campus, Delhi",
        monthlyPrice: 2500,
        foodType: "Both",
        description: "Best mess for North Indian food. Clean kitchen and hygienic preparation.",
        phoneNumber: "9876543210",
        website: "https://example.com/golden-fork"
    },
    {
        name: "South Spice Kitchen",
        location: "Greater Kailash, Delhi",
        monthlyPrice: 3000,
        foodType: "Veg",
        description: "Authentic South Indian vegetarian cuisine. Fresh vegetables daily.",
        phoneNumber: "9876543211",
        website: "https://example.com/south-spice"
    },
    {
        name: "Hostel Heaven",
        location: "Rohini, Delhi",
        monthlyPrice: 2000,
        foodType: "Both",
        description: "Budget-friendly mess with quality food. Great hygiene standards.",
        phoneNumber: "9876543212",
        website: "https://example.com/hostel-heaven"
    },
    {
        name: "Taste of Home",
        location: "Dwarka, Delhi",
        monthlyPrice: 2800,
        foodType: "Non-Veg",
        description: "Home-style cooking with chicken, mutton, and fish specialties.",
        phoneNumber: "9876543213",
        website: "https://example.com/taste-of-home"
    },
    {
        name: "Green Leaf Meals",
        location: "Noida, UP",
        monthlyPrice: 2200,
        foodType: "Veg",
        description: "Organic vegetables, no preservatives. Healthy eating for students.",
        phoneNumber: "9876543214",
        website: "https://example.com/green-leaf"
    },
    {
        name: "Royal Biryani House",
        location: "Sector 63, Noida",
        monthlyPrice: 3500,
        foodType: "Non-Veg",
        description: "Premium biryani and Mughlai cuisine. Weekend special events.",
        phoneNumber: "9876543215",
        website: "https://example.com/royal-biryani"
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();
        
        // Clear existing messes
        await Mess.deleteMany({});
        console.log('Cleared existing messes');
        
        // Create admin user
        const adminExists = await User.findOne({ email: 'admin123@gmail.com', role: 'admin' });
        if (!adminExists) {
            const adminUser = new User({
                name: 'Admin User',
                email: 'admin123@gmail.com',
                phone: '9999999999',
                password: 'admin123',
                role: 'admin'
            });
            await adminUser.save();
            console.log(' Admin user created: admin123@gmail.com / admin123');
        } else {
            console.log('Admin user already exists');
        }
        
        // Insert sample messes
        const createdMesses = await Mess.insertMany(sampleMesses);
        console.log(`Created ${createdMesses.length} sample messes`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
