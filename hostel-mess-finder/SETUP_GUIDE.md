# SETUP GUIDE - Hostel Mess Finder

## 🚀 Complete Setup Instructions

### Step 1: Prerequisites Check
```bash
# Check Node.js version (v14+)
node --version

# Check npm version (v6+)
npm --version

# Check Git
git --version
```

If any are missing, install from:
- Node.js: https://nodejs.org/
- Git: https://git-scm.com/

---

## 📦 Backend Setup

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables
- `cors` - Cross-origin requests
- `nodemon` - Development auto-reload

### Step 3: Create Environment File

Create `.env` file in `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel-mess-finder

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

### Step 4: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up with Google or Email
   - Create organization

2. **Create a Cluster**
   - Select "Create Deployment"
   - Choose "M0 Sandbox" (free tier)
   - Select region (closest to you)
   - Confirm

3. **Get Connection String**
   - Click "Connect"
   - Choose "Drivers"
   - Copy connection string:
     ```
     mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myFirstDatabase
     ```
   - Replace `username` and `password`
   - Replace database name with `hostel-mess-finder`

4. **Add IP Whitelist**
   - Go to Network Access
   - Click "Add IP Address"
   - Add current IP or "0.0.0.0/0" for all (development only)
   - Confirm

5. **Update .env**
   ```env
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/hostel-mess-finder
   ```

### Step 5: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

✅ Server should run on `http://localhost:5000`

### Step 6: Test Backend (Optional)

Open browser or use curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Expected response:
# {
#   "success": true,
#   "message": "Hostel Mess Finder API is running",
#   "timestamp": "2024-01-28T10:30:00.000Z"
# }
```

### Step 7: Seed Sample Data (Optional)

```bash
# In backend directory
node seed.js

# Creates 6 sample messes
```

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend
```bash
cd frontend
```

### Step 2: No Dependencies Required!

Hostel Mess Finder uses:
- Pure HTML5
- CSS3 (no frameworks)
- Vanilla JavaScript
- Fetch API for backend calls

**No npm install needed!** 🎉

### Step 3: Configure API URL

Verify `js/auth.js` has correct API URL:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

If backend runs on different port, update this URL.

### Step 4: Run Frontend

**Option A: VS Code Live Server (Recommended)**
```
1. Install "Live Server" extension in VS Code
2. Right-click index.html
3. Select "Open with Live Server"
4. Browser opens at http://localhost:5500
```

**Option B: Python HTTP Server**
```bash
# Python 3
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000

# Visit http://localhost:8000
```

**Option C: Node HTTP Server**
```bash
# Install globally (first time only)
npm install -g http-server

# Run
http-server

# Visit http://localhost:8080
```

---

## ✅ Verification Checklist

### Backend ✓
- [ ] `npm install` completed successfully
- [ ] `.env` file created with MongoDB URI and JWT secret
- [ ] `npm run dev` shows "Server running on http://localhost:5000"
- [ ] `http://localhost:5000/api/health` returns success response

### Frontend ✓
- [ ] `index.html` opens in browser
- [ ] All CSS styles load (no 404 errors in console)
- [ ] Navigation bar displays correctly
- [ ] Home page loads without errors

### Integration ✓
- [ ] Can navigate to register page
- [ ] Register form displays
- [ ] Register button triggers API call (check Network tab)
- [ ] Backend error/success messages show

---

## 🧪 Test the Application

### Test 1: User Registration
```
1. Go to http://localhost:5500/register.html
2. Fill in all fields:
   - Name: John Doe
   - Email: john@college.edu
   - Phone: 9876543210
   - College: Test University
   - Password: password123
3. Click "Create Account"
4. Should redirect to messes page
5. Check browser console (F12) for any errors
```

### Test 2: Login
```
1. Go to http://localhost:5500/login.html
2. Use registered email and password
3. Should redirect to messes page
4. Check localStorage (F12 > Application > Local Storage)
   - Should see 'token' and 'user'
```

### Test 3: Browse Messes
```
1. From messes page, you should see:
   - List of mess cards (from seed.js)
   - Search bar working
   - Filters for food type, price, rating
2. Click on a mess card
3. Should go to mess-details page
4. See mess information and reviews
```

### Test 4: Create Review
```
1. Go to mess-details page
2. Review form should be visible (since you're logged in)
3. Click stars to rate (1-5)
4. Enter review text
5. Click "Submit Review"
6. Should see your review appear immediately
7. Check Network tab to see API call to /api/reviews
```

### Test 5: Dashboard
```
1. Click "Dashboard" in navigation
2. Should show your profile info
3. Click "My Reviews" tab
4. Should see reviews you created
5. Test Edit and Delete buttons
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Check MongoDB URI in `.env`
- Verify username/password are correct
- Check IP address is whitelisted in MongoDB Atlas
- Test connection: `mongodb+srv://...`

### Issue: "CORS error" or "Network error"
**Solution:**
- Ensure backend is running on port 5000
- Check `API_BASE_URL` in `js/auth.js`
- Verify CORS is enabled in `server.js`
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Unauthorized" when creating review
**Solution:**
- Check token is stored in localStorage
- Verify token hasn't expired (30 days)
- Check `Authorization` header sent correctly
- Try logging in again

### Issue: Frontend shows "Loading..." forever
**Solution:**
- Check browser console (F12) for errors
- Verify backend is running
- Check Network tab (F12) to see API calls
- Make sure API_BASE_URL is correct

### Issue: Styles not loading (page looks broken)
**Solution:**
- Clear browser cache
- Check CSS file paths are correct
- Verify Live Server is running
- Check console for 404 errors on CSS files

### Issue: "One review per student per mess" error
**Solution:**
- This is normal! Each student can only review each mess once
- Edit your existing review instead
- Or test with a different mess

---

## 📱 Testing on Mobile

### Using ngrok (Expose Local Server)
```bash
# Install ngrok from https://ngrok.com/download

# Start ngrok
ngrok http 8000

# Get URL like https://xyz.ngrok.io
# Open on phone browser
```

### Using Local Network
```bash
# Get your computer's IP
# Windows: ipconfig
# Mac/Linux: ifconfig

# Tell http-server to listen on all interfaces
http-server -a 0.0.0.0 -p 8000

# On phone, visit http://YOUR_IP:8000
```

---

## 🚀 Development Workflow

### During Development
```bash
# Terminal 1: Run Backend
cd backend
npm run dev

# Terminal 2: Run Frontend
cd frontend
http-server

# Or use Live Server in VS Code
```

### Edit Code
- **Backend Changes**: Auto-reloads with nodemon
- **Frontend Changes**: Refresh browser (F5)

### Debug JavaScript
```
Browser DevTools (F12):
- Console: JavaScript errors
- Network: API calls
- Application: localStorage, tokens
- Elements: HTML/CSS inspection
```

---

## 📝 Environment Variables Reference

### Backend (.env)
```env
# Port to run server on
PORT=5000

# Database connection string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hostel-mess-finder

# JWT secret for token signing (change in production!)
JWT_SECRET=your_secret_key_here_minimum_20_chars

# Environment mode
NODE_ENV=development
```

### Frontend (js/auth.js)
```javascript
// Update if backend runs on different URL
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 📚 Useful Resources

- **Express.js Docs**: https://expressjs.com/
- **MongoDB Docs**: https://docs.mongodb.com/
- **Mongoose Docs**: https://mongoosejs.com/
- **JWT Guide**: https://jwt.io/introduction
- **MDN Web Docs**: https://developer.mozilla.org/
- **CSS Tricks**: https://css-tricks.com/

---

## ✨ You're All Set! 🎉

Your Hostel Mess Finder application is ready to use!

### Next Steps:
1. Explore the application
2. Create reviews and ratings
3. Test all features
4. Deploy to production
5. Share with your college community

### Need Help?
- Check README.md for API documentation
- Review code comments
- Check browser console for errors
- Refer to troubleshooting section

---

**Happy coding! 🚀**

For updates and contributions: https://github.com/yourname/hostel-mess-finder
