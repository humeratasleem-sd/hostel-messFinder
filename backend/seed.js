// Sample data for populating the database
// Run this script to seed initial messes

const mongoose = require('mongoose');
const Mess = require('./models/Mess');
const User = require('./models/User');
require('dotenv').config();

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is required for seeding.');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const sampleMesses = [
    {
        name: "Sri Sai Hostel Mess",
        location: "Near Engineering Campus, Delhi",
        monthlyPrice: 2500,
        foodType: "Both",
        description: "Best mess for homemade food. Clean kitchen and hygienic preparation.",
        phoneNumber: "9876543210",
        website: "https://example.com/sri-sai-mess",
        foodSchedule: {
            breakfast: { available: true, time: '7:30 AM - 9:30 AM', description: 'Idli, Dosa, Poha with Chutney & Sambar' },
            lunch: { available: true, time: '12:30 PM - 2:30 PM', description: 'Rice, Roti, Dal, Paneer/Chicken gravy, Salad' },
            dinner: { available: true, time: '7:30 PM - 9:30 PM', description: 'Roti, Rice, Seasonal Veg, Egg/Fish Curry' },
            snacks: { available: true, time: '4:30 PM - 5:30 PM', description: 'Tea, Coffee, Samosa or Biscuits' }
        }
    },
    {
        name: "VVIT Boys Mess",
        location: "Greater Campus Area",
        monthlyPrice: 3000,
        foodType: "Veg",
        description: "Authentic South Indian vegetarian cuisine. Fresh vegetables daily.",
        phoneNumber: "9876543211",
        website: "https://example.com/vvit-boys-mess",
        foodSchedule: {
            breakfast: { available: true, time: '7:00 AM - 9:00 AM', description: 'Upma, Vada, Pongal, Tea/Coffee' },
            lunch: { available: true, time: '12:00 PM - 2:00 PM', description: 'South Indian Thali (Unlimited Rice, Sambar, Rasam, Curd)' },
            dinner: { available: true, time: '7:30 PM - 9:30 PM', description: 'Chapati, Fried Rice, Mixed Veg Curry' },
            snacks: { available: false, time: '-', description: '-' }
        }
    },
    {
        name: "Annapurna Girls Mess",
        location: "Rohini, Delhi",
        monthlyPrice: 2000,
        foodType: "Both",
        description: "Budget-friendly mess with quality food for girls. Great hygiene standards.",
        phoneNumber: "9876543212",
        website: "https://example.com/annapurna-girls-mess",
        foodSchedule: {
            breakfast: { available: true, time: '8:00 AM - 10:00 AM', description: 'Aloo Paratha, Bread Toast, Milk/Tea' },
            lunch: { available: true, time: '1:00 PM - 3:00 PM', description: 'Rajma Chawal, Roti, Curd, Salad' },
            dinner: { available: true, time: '8:00 PM - 10:00 PM', description: 'Paneer Butter Masala, Butter Naan, Gulab Jamun' },
            snacks: { available: true, time: '5:00 PM - 6:00 PM', description: 'Maggi, Pakoras, Tea' }
        }
    },
    {
        name: "Andhra Spice Mess",
        location: "Dwarka, Delhi",
        monthlyPrice: 2800,
        foodType: "Non-Veg",
        description: "Spicy home-style cooking with chicken, mutton, and fish specialties.",
        phoneNumber: "9876543213",
        website: "https://example.com/andhra-spice-mess",
        foodSchedule: {
            breakfast: { available: true, time: '7:00 AM - 9:30 AM', description: 'Pesarattu, Onion Dosa, Filter Coffee' },
            lunch: { available: true, time: '12:30 PM - 3:00 PM', description: 'Andhra Meals with Spicy Chicken/Mutton Roast' },
            dinner: { available: true, time: '7:30 PM - 10:00 PM', description: 'Hyderabadi Chicken Biryani (Wed/Sun), Bagara Rice' },
            snacks: { available: false, time: '-', description: '-' }
        }
    },
    {
        name: "Saraswati Students Mess",
        location: "Noida, UP",
        monthlyPrice: 2200,
        foodType: "Veg",
        description: "Pure vegetarian meals. Healthy eating for students.",
        phoneNumber: "9876543214",
        website: "https://example.com/saraswati-mess",
        foodSchedule: {
            breakfast: { available: true, time: '7:30 AM - 9:00 AM', description: 'Puri Sabji, Sprouts, Fruit Salad' },
            lunch: { available: true, time: '12:30 PM - 2:00 PM', description: 'Simple Thali: Rice, Dal Tadka, Gobi Aloo, Roti' },
            dinner: { available: true, time: '7:30 PM - 9:00 PM', description: 'Khichdi, Kadhi Pakora, Papad, Pickle' },
            snacks: { available: true, time: '4:00 PM - 5:00 PM', description: 'Roasted Makhana, Green Tea' }
        }
    },
    {
        name: "Balaji Deluxe Mess",
        location: "Sector 63, Noida",
        monthlyPrice: 3500,
        foodType: "Non-Veg",
        description: "Premium meals and occasional biryani. Weekend special events.",
        phoneNumber: "9876543215",
        website: "https://example.com/balaji-deluxe-mess",
        foodSchedule: {
            breakfast: { available: true, time: '8:00 AM - 10:30 AM', description: 'Chole Bhature, Omelette, Fresh Juice' },
            lunch: { available: true, time: '1:00 PM - 3:30 PM', description: 'Deluxe Thali (2 Non-Veg, 2 Veg items, Sweets)' },
            dinner: { available: true, time: '8:00 PM - 10:30 PM', description: 'Tandoori Chicken/Fish Tikka, Butter Roti' },
            snacks: { available: true, time: '5:00 PM - 6:30 PM', description: 'Chicken Sandwich, French Fries, Milkshake' }
        }
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();
        
        // Clear existing messes and users to avoid clutter or duplicates during seed
        await Mess.deleteMany({});
        console.log('Cleared existing messes');
        
        // Create admin user
        const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin123@gmail.com';
        const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
        let adminExists = await User.findOne({ email: adminEmail, role: 'admin' });
        if (!adminExists) {
            adminExists = new User({
                name: 'Admin User',
                email: adminEmail,
                phone: '9999999999',
                password: adminPassword,
                role: 'admin'
            });
            await adminExists.save();
            console.log(`Admin user created: ${adminEmail}`);
        } else {
            console.log('Admin user already exists');
        }
        
        // Create dummy hostel owner
        const ownerEmail = 'owner1@example.com';
        let ownerUser = await User.findOne({ email: ownerEmail, role: 'hostel_owner' });
        if (!ownerUser) {
            ownerUser = new User({
                name: 'Ramesh (Owner)',
                email: ownerEmail,
                phone: '8888888888',
                password: 'password123',
                role: 'hostel_owner'
            });
            await ownerUser.save();
            console.log(`Dummy owner created: ${ownerEmail}`);
        } else {
            console.log('Dummy owner already exists');
        }

        // Attach ownerId to messes
        const messesWithOwner = sampleMesses.map(mess => ({
            ...mess,
            ownerId: ownerUser._id
        }));

        // Insert sample messes
        const createdMesses = await Mess.insertMany(messesWithOwner);
        console.log(`Created ${createdMesses.length} sample messes with owner references`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
