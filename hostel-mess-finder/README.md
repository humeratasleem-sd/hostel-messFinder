# 🍽️ Hostel Mess Finder

**A production-ready, full-stack web application for discovering and reviewing hostel mess facilities with verified student reviews.**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Frontend Architecture](#frontend-architecture)
- [Database Models](#database-models)
- [Security Features](#security-features)
- [Deployment Guide](#deployment-guide)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)

---

## 🎯 Overview

**Hostel Mess Finder** is a centralized platform where students can discover, rate, and review hostel mess facilities in their area. The application ensures authenticity through verified student-only reviews, similar to Flipkart's verified buyer system.

### Key Value Propositions:
- ✅ **Verified Reviews Only**: Only authenticated students can submit reviews
- ⭐ **Comprehensive Ratings**: Rate on food quality, hygiene, and overall satisfaction
- 🔍 **Smart Search & Filter**: Find messes by location, price, food type, and ratings
- 📊 **Real-time Analytics**: Dynamic rating calculations and statistics
- 🛡️ **Secure & Private**: JWT authentication and encrypted passwords
- 📱 **Fully Responsive**: Mobile-first design for all devices

---

## 🔍 Problem Statement

**The Challenge:**
Students living in hostels or PG accommodations struggle to:
- Find quality mess facilities with verified feedback
- Compare prices, food quality, and hygiene standards
- Make informed decisions before selecting a mess
- Access a centralized, trustworthy review platform

**The Solution:**
Hostel Mess Finder bridges this gap by providing a verified student review platform where:
- Only authenticated students can post reviews
- Each student can review each mess only once
- Ratings are calculated dynamically based on multiple dimensions
- Comprehensive filtering helps find the perfect mess

---

## ✨ Features

### 🔐 Authentication & Authorization
- Student registration with email verification
- Secure login with JWT tokens
- Password hashing using bcrypt
- Protected routes for authenticated users
- Token-based authorization for all API endpoints

### 🏠 Mess Management
- Browse all available messes
- Detailed mess information (name, location, price, food type)
- Hygiene and food quality ratings
- Contact information and website links
- Comprehensive mess descriptions

### ⭐ Review & Rating System
- 5-star rating system with 1-5 star scale
- Separate ratings for:
  - Overall satisfaction
  - Food quality
  - Hygiene standards
- Text feedback (up to 1000 characters)
- "Verified Student" badge on all reviews
- One review per student per mess enforcement
- Average rating calculations updated in real-time

### 🔍 Search & Filter
- **Client-side filtering** with instant results
- Search by mess name or location
- Filter by:
  - Food type (Veg/Non-Veg/Both)
  - Price range
  - Minimum rating
- Responsive filter UI on all pages

### 👤 Student Dashboard
- View student profile with college information
- Track submitted reviews
- Edit or delete existing reviews
- View average ratings across reviews
- Manage account settings

### 📱 User Interface
- Modern, clean design with gradient accents
- Flipkart-style star ratings
- Card-based mess listing
- Responsive grid layouts
- Mobile-first approach
- Smooth animations and transitions
- Real-time character counter for reviews

---

## 🛠 Tech Stack

### Frontend
```
HTML5              - Semantic structure
CSS3               - Styling with Flexbox & Grid
JavaScript (ES6)   - Client-side logic
Fetch API          - HTTP requests
LocalStorage       - Token management
```

### Backend
```
Node.js            - Runtime environment
Express.js         - Web framework
MongoDB            - NoSQL database
Mongoose           - ODM for MongoDB
JWT                - Token-based authentication
bcryptjs           - Password hashing
CORS               - Cross-origin requests
```

### Infrastructure
```
MongoDB Atlas      - Cloud database (production)
Render/Railway     - Backend deployment
Netlify/Vercel     - Frontend deployment
```

---

## 📁 Project Structure

```
hostel-mess-finder/
│
├── frontend/
│   ├── index.html                 # Home page
│   ├── register.html              # Student registration
│   ├── login.html                 # Student login
│   ├── messes.html                # Mess listing & filtering
│   ├── mess-details.html          # Mess details & reviews
│   ├── dashboard.html             # Student dashboard
│   ├── css/
│   │   ├── styles.css             # Main styles
│   │   └── responsive.css         # Mobile responsiveness
│   └── js/
│       ├── auth.js                # Authentication logic
│       ├── main.js                # Homepage functionality
│       ├── messes.js              # Mess listing & filtering
│       ├── mess-details.js        # Reviews & ratings
│       └── dashboard.js           # Dashboard functionality
│
├── backend/
│   ├── server.js                  # Express app entry point
│   ├── package.json               # Dependencies
│   ├── .env.example               # Environment variables template
│   ├── .gitignore
│   ├── config/
│   │   └── database.js            # MongoDB connection
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Mess.js                # Mess schema
│   │   └── Review.js              # Review schema
│   ├── controllers/
│   │   ├── authController.js      # Auth endpoints
│   │   ├── messController.js      # Mess endpoints
│   │   └── reviewController.js    # Review endpoints
│   ├── routes/
│   │   ├── auth.js                # Auth routes
│   │   ├── mess.js                # Mess routes
│   │   └── review.js              # Review routes
│   └── middleware/
│       └── auth.js                # JWT verification
│
└── README.md                      # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14+)
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier available)
- **Code editor** (VS Code recommended)

### Step 1: Clone or Create Project

```bash
# Navigate to project directory
cd hostel-mess-finder
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel-mess-finder
# JWT_SECRET=your_super_secret_key_change_in_production
# PORT=5000
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend
cd ../frontend

# No installation needed! Frontend uses Vanilla JS and runs directly in browser
# Open index.html in VS Code with Live Server extension, or use:
# python -m http.server 8000
# Then navigate to http://localhost:8000
```

### Step 4: Database Setup

1. Create MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Add connection string to `.env` file
5. Add your IP address to IP whitelist in MongoDB Atlas

---

## ▶️ Running the Application

### Start Backend Server

```bash
cd backend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Server runs on http://localhost:5000
# API health check: http://localhost:5000/api/health
```

### Start Frontend

**Option 1: Using VS Code Live Server**
```bash
cd frontend
# Right-click index.html → "Open with Live Server"
# Opens at http://localhost:5500
```

**Option 2: Using Python**
```bash
cd frontend
python -m http.server 8000
# Navigate to http://localhost:8000
```

**Option 3: Using Node http-server**
```bash
npm install -g http-server
cd frontend
http-server
# Navigate to http://localhost:8080
```

### Access Application

- **Home**: http://localhost:5500
- **Register**: http://localhost:5500/register.html
- **Login**: http://localhost:5500/login.html
- **Browse Messes**: http://localhost:5500/messes.html
- **Dashboard**: http://localhost:5500/dashboard.html

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register Student
```
POST /auth/register

Request Body:
{
  "name": "John Doe",
  "email": "john@college.edu",
  "phone": "9876543210",
  "college": "College Name",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "64a5f3...",
    "name": "John Doe",
    "email": "john@college.edu",
    "college": "College Name"
  }
}
```

#### Login Student
```
POST /auth/login

Request Body:
{
  "email": "john@college.edu",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### Get Current User
```
GET /auth/me
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "id": "64a5f3...",
    "name": "John Doe",
    "email": "john@college.edu",
    "phone": "9876543210",
    "college": "College Name",
    "createdAt": "2024-01-28T10:30:00Z"
  }
}
```

### Mess Endpoints

#### Get All Messes (with Filtering)
```
GET /messes?search=&priceMin=&priceMax=&foodType=&ratingMin=

Query Parameters:
- search (optional): Search by name or location
- priceMin (optional): Minimum monthly price
- priceMax (optional): Maximum monthly price
- foodType (optional): Veg/Non-Veg/Both
- ratingMin (optional): Minimum rating

Response:
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "64a5f3...",
      "name": "Mess Name",
      "location": "Location",
      "monthlyPrice": 2500,
      "foodType": "Both",
      "hygieneRating": 4.2,
      "foodQualityRating": 4.0,
      "overallRating": 4.1,
      "totalReviews": 15
    }
  ]
}
```

#### Get Mess Details
```
GET /messes/:messId

Response:
{
  "success": true,
  "data": { ... (full mess object) ... }
}
```

### Review Endpoints

#### Get Reviews for a Mess
```
GET /reviews/mess/:messId

Response:
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "64a5f3...",
      "userId": {
        "_id": "64a5f3...",
        "name": "John Doe",
        "college": "College Name"
      },
      "messId": "64a5f3...",
      "rating": 4,
      "hygieneRating": 4,
      "foodQualityRating": 4,
      "review": "Great food and hygiene...",
      "verifiedStudent": true,
      "createdAt": "2024-01-28T10:30:00Z"
    }
  ]
}
```

#### Create Review
```
POST /reviews
Headers: Authorization: Bearer <token>

Request Body:
{
  "messId": "64a5f3...",
  "rating": 4,
  "hygieneRating": 4,
  "foodQualityRating": 4,
  "review": "Great food and clean environment"
}

Response:
{
  "success": true,
  "data": { ... (review object) ... }
}
```

#### Update Review
```
PUT /reviews/:reviewId
Headers: Authorization: Bearer <token>

Request Body:
{
  "rating": 5,
  "review": "Updated review text"
}

Response:
{
  "success": true,
  "data": { ... (updated review) ... }
}
```

#### Delete Review
```
DELETE /reviews/:reviewId
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Review deleted successfully"
}
```

#### Get User's Reviews
```
GET /reviews/user/my-reviews
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 3,
  "data": [ ... ]
}
```

---

## 🏗️ Frontend Architecture

### Authentication Flow
```
1. User registers with email, phone, college
2. Password hashed with bcrypt on backend
3. JWT token returned to frontend
4. Token stored in localStorage
5. Token included in Authorization header for protected requests
6. If token expired or invalid, redirect to login
```

### Component Separation
- **auth.js**: Handles JWT tokens and navigation updates
- **main.js**: Homepage stats and data loading
- **messes.js**: Mess listing, search, and client-side filtering
- **mess-details.js**: Review display, submission, and star ratings
- **dashboard.js**: User profile and review management

### Data Flow
```
Frontend (Fetch API) 
    ↓
Express Router
    ↓
Controller Logic
    ↓
Mongoose Model
    ↓
MongoDB Database
```

---

## 🗄️ Database Models

### User Model
```javascript
{
  name: String (required, max 100),
  email: String (required, unique, email format),
  phone: String (required, 10 digits),
  college: String (required),
  password: String (required, hashed with bcrypt),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

### Mess Model
```javascript
{
  name: String (required, max 150),
  location: String (required),
  monthlyPrice: Number (required, min 0),
  foodType: String (enum: Veg/Non-Veg/Both),
  hygieneRating: Number (0-5, calculated from reviews),
  foodQualityRating: Number (0-5, calculated from reviews),
  overallRating: Number (0-5, calculated from reviews),
  totalReviews: Number (count of reviews),
  description: String (max 500),
  phoneNumber: String (10 digits),
  website: String (URL format),
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  userId: ObjectId (ref: User, required),
  messId: ObjectId (ref: Mess, required),
  rating: Number (1-5, required),
  hygieneRating: Number (1-5),
  foodQualityRating: Number (1-5),
  review: String (required, max 1000),
  verifiedStudent: Boolean (default: true),
  helpful: Number (default: 0),
  createdAt: Date,
  updatedAt: Date,
  
  // Unique constraint on (userId, messId) - one review per student per mess
  Index: { userId: 1, messId: 1, unique: true }
}
```

---

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: 30-day expiration
- **Bcrypt Hashing**: Passwords salted with 10 rounds
- **Protected Routes**: Token verification middleware on all protected endpoints
- **One Review Per Student**: Unique index on (userId, messId)

### Input Validation
- Email format validation
- Phone number length validation (10 digits)
- Password minimum length (6 characters)
- Text field length limits
- Numeric range validation for ratings

### CORS Configuration
- Only allows requests from localhost and specified frontends
- Credentials allowed for cookie-based sessions

### Data Protection
- Passwords not returned in API responses
- Sensitive data protected with proper authorization checks
- User can only edit/delete their own reviews

---

## 🚀 Deployment Guide

### Backend Deployment (Render/Railway)

#### Option 1: Render
1. Push code to GitHub
2. Connect Render to GitHub repository
3. Create new Web Service
4. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   ```
5. Deploy

#### Option 2: Railway
1. Push code to GitHub
2. Create new project on Railway
3. Connect GitHub repository
4. Add MongoDB plugin (or use Atlas URI)
5. Add environment variables
6. Deploy

### Frontend Deployment (Netlify/Vercel)

#### Option 1: Netlify
1. Drag and drop `frontend` folder to Netlify
2. Set build command: `npm run build` (if needed)
3. Configure `_redirects` file for SPA routing
4. Deploy

#### Option 2: Vercel
1. Connect GitHub repository
2. Select `frontend` as root directory
3. Add build configuration
4. Deploy

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas (free tier available)
2. Get connection string
3. Add IP address to whitelist
4. Use connection string in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel-mess-finder
   ```

---

## 🔮 Future Enhancements

### Phase 2: Advanced Features
- [ ] Admin dashboard for mess management
- [ ] Hostel owner accounts
- [ ] Image uploads for mess facilities
- [ ] Email notifications
- [ ] User profile pictures
- [ ] Reply to reviews
- [ ] Helpful votes on reviews

### Phase 3: Mobile & Scale
- [ ] Native mobile app (React Native/Flutter)
- [ ] Push notifications
- [ ] Offline support
- [ ] AI-based recommendations
- [ ] Food quality insights with ML
- [ ] Real-time chat support

### Phase 4: Business Features
- [ ] Premium listings for mess owners
- [ ] Analytics dashboard
- [ ] Subscription plans
- [ ] Verified mess badges
- [ ] Promotional campaigns
- [ ] Payment integration

---

## 📝 Contributing

### How to Contribute
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Coding Standards
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code style
- Test before submitting PR
- Update README for new features

---

## 📧 Support & Contact

For questions or issues:
- Create issue on GitHub
- Email: support@hostelmessfinder.com
- Join our community discussions

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🎓 Interview-Ready Highlights

### What Makes This Production-Ready?

✅ **Scalable Architecture**
- Modular backend with MVC pattern
- Separation of concerns (routes, controllers, models)
- Database abstraction with Mongoose

✅ **Security**
- JWT authentication with token expiration
- Bcrypt password hashing
- Input validation and sanitization
- CORS protection

✅ **User Experience**
- Responsive design (mobile-first)
- Fast load times with efficient queries
- Intuitive UI/UX patterns
- Real-time filtering and search

✅ **Code Quality**
- Clean, readable code
- Well-documented APIs
- Consistent naming conventions
- Error handling throughout

✅ **Best Practices**
- Environment variables for configuration
- REST API standards
- Proper HTTP status codes
- Comprehensive API documentation

✅ **Performance**
- Database indexing for fast queries
- Client-side filtering for instant UX
- Lazy loading capabilities
- Optimized queries with select()

---

## 🙏 Acknowledgments

Built with passion for college students by the community.

**Happy coding! 🚀**

---

**Last Updated**: January 28, 2026
**Version**: 1.0.0
**Status**: Production Ready
