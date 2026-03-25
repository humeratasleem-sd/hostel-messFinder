const mongoose = require('mongoose');

const messSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide mess name'],
    trim: true,
    maxlength: [150, 'Name cannot exceed 150 characters']
  },
  location: {
    type: String,
    required: [true, 'Please provide location'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  capacity: {
    type: Number,
    min: 0
  },
  facilities: [{
    type: String
  }],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  joinedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  monthlyPrice: {
    type: Number,
    required: [true, 'Please provide monthly price'],
    min: [0, 'Price cannot be negative']
  },
  foodType: {
    type: String,
    enum: ['Veg', 'Non-Veg', 'Both'],
    required: [true, 'Please specify food type'],
    default: 'Both'
  },
  hygieneRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  foodQualityRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  overallRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  phoneNumber: {
    type: String,
    match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
  },
  website: {
    type: String,
    match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please provide a valid website URL']
  },
  foodSchedule: {
    breakfast: {
      available: { type: Boolean, default: true },
      time: { type: String, default: '7:00 AM - 9:00 AM' },
      description: String
    },
    lunch: {
      available: { type: Boolean, default: true },
      time: { type: String, default: '12:00 PM - 2:00 PM' },
      description: String
    },
    dinner: {
      available: { type: Boolean, default: true },
      time: { type: String, default: '7:00 PM - 9:00 PM' },
      description: String
    },
    snacks: {
      available: { type: Boolean, default: false },
      time: { type: String, default: '4:00 PM - 5:00 PM' },
      description: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create geospatial index for location-based queries
messSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Mess', messSchema);
