# Hostel Mess Finder - Backend API

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create `.env` file in root directory:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel-mess-finder
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. Seed Database (Optional)
```bash
node seed.js
```

### 4. Start Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Auth Routes (`/api/auth`)
- `POST /register` - Register new student
- `POST /login` - Login student
- `GET /me` - Get current user (protected)

### Mess Routes (`/api/messes`)
- `GET /` - Get all messes with filtering
- `GET /:id` - Get single mess details
- `POST /` - Create mess (protected)
- `PUT /:id` - Update mess (protected)
- `DELETE /:id` - Delete mess (protected)

### Review Routes (`/api/reviews`)
- `GET /mess/:messId` - Get reviews for a mess
- `GET /user/my-reviews` - Get user's reviews (protected)
- `POST /` - Create review (protected)
- `PUT /:reviewId` - Update review (protected)
- `DELETE /:reviewId` - Delete review (protected)
- `GET /stats/:messId` - Get review statistics

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | JWT signing secret | your_secret_key |
| NODE_ENV | Environment | development/production |

## Database Models

### User
- name, email, phone, college, password
- Unique: email
- Passwords hashed with bcrypt

### Mess
- name, location, monthlyPrice, foodType
- Ratings: hygieneRating, foodQualityRating, overallRating
- totalReviews count, description, contact

### Review
- userId, messId, rating, review
- hygieneRating, foodQualityRating
- verifiedStudent badge
- Unique: (userId, messId) - one review per student per mess

## Project Structure

```
backend/
├── server.js              # Entry point
├── package.json
├── .env.example
├── seed.js               # Database seeding
├── config/
│   └── database.js       # MongoDB connection
├── models/
│   ├── User.js
│   ├── Mess.js
│   └── Review.js
├── controllers/
│   ├── authController.js
│   ├── messController.js
│   └── reviewController.js
├── routes/
│   ├── auth.js
│   ├── mess.js
│   └── review.js
└── middleware/
    └── auth.js           # JWT verification
```

## Technologies Used
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## Security Features
- JWT token authentication (30-day expiration)
- Bcrypt password hashing (10 rounds)
- Protected routes with middleware
- One review per student per mess enforcement
- Input validation
- CORS protection

## Deployment

### Render
1. Push to GitHub
2. Connect Render to repo
3. Set environment variables
4. Deploy

### Railway
1. Push to GitHub
2. Connect Railway
3. Add environment variables
4. Deploy

### Heroku
```bash
npm install -g heroku
heroku login
heroku create app-name
git push heroku main
```

## Development

### Run with Nodemon
```bash
npm run dev
```

### MongoDB Local Setup (Optional)
```bash
# Instead of MongoDB Atlas, run locally
MONGODB_URI=mongodb://localhost:27017/hostel-mess-finder npm run dev
```

## Troubleshooting

### MongoDB Connection Error
- Check MongoDB Atlas credentials in `.env`
- Verify IP whitelist includes your IP
- Ensure network connectivity

### JWT Token Issues
- Verify JWT_SECRET is set
- Check token expiration
- Clear localStorage on client side

### CORS Errors
- Frontend URL should be in CORS whitelist
- Check server.js cors configuration

## Future Enhancements
- [ ] Admin dashboard
- [ ] Image uploads
- [ ] Email notifications
- [ ] Mess owner accounts
- [ ] Analytics
- [ ] Payment integration

---

**Made with ❤️ for college students**
