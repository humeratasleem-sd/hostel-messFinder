# Project Configuration Files

## Backend Environment Variables (.env)
Create a `.env` file in the `backend/` directory with:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration - MongoDB Atlas
# Get this from https://www.mongodb.com/cloud/atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hostel-mess-finder

# JWT Secret - Change this in production!
# Use a strong random string (min 30 characters)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

## Frontend Configuration
The frontend uses Vanilla JavaScript with no build process.
Update API URL in `frontend/js/auth.js` if needed:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## MongoDB Atlas Setup

1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create a cluster (M0 free tier)
3. Get connection string from "Connect" button
4. Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database_name`

## Environment Variables Description

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment type | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT signing key (keep secret!) | `your_long_random_string_here` |

## Security Notes

- Never commit `.env` files to Git
- `.gitignore` already excludes `.env`
- Use strong random values for JWT_SECRET
- Change JWT_SECRET in production
- Store sensitive data in environment, not code
- Use MongoDB Atlas IP whitelist

## Deployment

For production deployment:
1. Use environment variables from hosting platform
2. Change JWT_SECRET to strong random value
3. Use production MongoDB URI
4. Set NODE_ENV=production
5. Enable HTTPS

## Local Development

For local development, you can also:
1. Run MongoDB locally
2. Use: `MONGODB_URI=mongodb://localhost:27017/hostel-mess-finder`

---

**Keep your secrets safe! 🔐**
