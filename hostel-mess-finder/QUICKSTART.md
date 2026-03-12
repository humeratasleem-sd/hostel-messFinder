# ⚡ Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js v14+ (https://nodejs.org/)
- MongoDB Atlas account (https://mongodb.com/cloud/atlas)

---

## Step 1: MongoDB Setup (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create M0 cluster (free tier)
4. Click "Connect" → Get connection string
5. Copy URL like: `mongodb+srv://username:password@cluster.mongodb.net/hostel-mess-finder`

---

## Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install packages
npm install

# Create .env file with:
# PORT=5000
# NODE_ENV=development
# MONGODB_URI=mongodb+srv://... (from Step 1)
# JWT_SECRET=your_secret_key_here

# Start server
npm run dev
```

✅ Server running on http://localhost:5000/api/health

---

## Step 3: Frontend Setup (1 minute)

```bash
# Navigate to frontend
cd frontend

# Option A: Use Live Server (VS Code extension)
# Right-click index.html → "Open with Live Server"

# Option B: Python
python -m http.server 8000

# Option C: Node http-server
npx http-server
```

✅ Frontend running on http://localhost:5500 (or 8000/8080)

---

## Step 4: Test It! (0 minutes)

1. **Register**: Go to `/register.html`
   - Create account with any email
   
2. **Browse**: See mess listings on `/messes.html`

3. **Review**: Click any mess and submit a review

4. **Dashboard**: View your reviews in dashboard

---

## 📝 Create .env File Example

**`backend/.env`**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/hostel-mess-finder
JWT_SECRET=my_super_secret_key_12345
```

---

## 🔗 Important URLs

- **Home**: http://localhost:5500
- **API Health**: http://localhost:5000/api/health
- **Messes API**: http://localhost:5000/api/messes
- **Docs**: See [README.md](README.md)

---

## ✨ Features Ready to Use

✅ Student registration & login  
✅ Browse messes with search & filter  
✅ Write reviews with star ratings  
✅ Dashboard with your reviews  
✅ One review per student enforcement  
✅ Real-time rating calculations  
✅ Verified student badges  
✅ Responsive mobile design  

---

## 🆘 Troubleshooting

**Can't connect to MongoDB?**
- Check connection string in `.env`
- Add your IP to MongoDB Atlas whitelist

**Frontend shows "Network Error"?**
- Make sure backend is running
- Check `API_BASE_URL` in `js/auth.js`

**Port already in use?**
- Change PORT in `.env` or stop other services

**Styles look broken?**
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page

---

## 📚 Full Documentation

- [Complete Setup Guide](SETUP_GUIDE.md)
- [API Documentation](README.md#api-documentation)
- [API Testing Examples](API_TESTING.md)
- [Project README](README.md)

---

## 🎓 Next Steps

1. ✅ Get application running
2. 📖 Read [README.md](README.md)
3. 🧪 Test with [API_TESTING.md](API_TESTING.md)
4. 🚀 Deploy to production
5. 👥 Share with your college community

---

**That's it! You're ready to go! 🎉**

Questions? Check the full [SETUP_GUIDE.md](SETUP_GUIDE.md)
