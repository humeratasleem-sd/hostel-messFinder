# 🚀 Quick Start Guide - Dark Mode Features

## Installation & Running

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Start Backend Server
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Open Frontend
Open any browser and navigate to:
```
http://localhost:5000
```

---

## 🔐 Admin Login

### Default Credentials
- **Username**: `admin123`
- **Password**: `admin123`

### Steps:
1. Click "Admin" button on login page
2. Or navigate directly to `/admin-login.html`
3. Enter credentials
4. Click "Login to Admin Panel"

---

## 📸 Using New Review Features

### Add Review with Image & Quantity:

1. **Login as Student**
   - Email: (your registered email)
   - Password: (your registered password)

2. **Navigate to a Mess**
   - Go to "Browse Messes"
   - Click on any mess card

3. **Create Review**
   - Fill in **Overall Rating** (1-5 stars)
   - Fill in **Food Quality Rating** (optional)
   - Fill in **Hygiene Rating** (optional)
   - Enter **Your Review** text (max 1000 chars)
   - **Select Quantity** → Choose "Limited" or "Unlimited"
   - **Upload Food Photo** → Select an image file
   - See real-time preview of your image
   - Click **Submit Review**

4. **View Your Review**
   - Image appears in review card
   - Quantity badge shows (📦 Limited/Unlimited)
   - Your photo is displayed

---

## 🎨 Dark Mode Features

### Text Hover Colors
- **Paragraphs**: Red (#FF6B6B)
- **Span/Small text**: Teal (#4ecdc4)
- **Links**: Red (#FF6B6B)
- **Headings**: Purple (#667eea)

Try hovering over any text to see the color change!

### Dark Theme Elements
- Dark cards with borders
- Glassmorphic effect (frosted glass)
- Smooth hover animations
- Color gradients
- Responsive on all devices

---

## 📱 Pages & Features

### Public Pages
- `index.html` - Home page (dark mode)
- `login.html` - User login (3 options)
- `register.html` - User registration
- `admin-login.html` - Admin login (NEW)
- `messes.html` - Browse all messes

### Protected Pages
- `dashboard.html` - Student dashboard
- `owner-dashboard.html` - Owner dashboard
- `admin-dashboard.html` - Admin dashboard
- `mess-details.html` - Individual mess with reviews

### Features on Mess Details
- View all reviews
- Add new review with:
  - Star ratings
  - Text review
  - **Quantity selector** (NEW)
  - **Image upload** (NEW)
  - Real-time preview (NEW)
- Edit/Delete your reviews

---

## 🔍 Testing Checklist

### Dark Mode
- [ ] Homepage has dark background
- [ ] All text is white/light colored
- [ ] Cards have dark backgrounds
- [ ] Borders are visible on dark cards
- [ ] Hover over text changes color

### Admin Login
- [ ] Can login with admin123/admin123
- [ ] Redirects to admin dashboard
- [ ] Token saved in localStorage

### Review Features
- [ ] Can select Quantity (Limited/Unlimited)
- [ ] Image preview shows before upload
- [ ] Image displays in submitted review
- [ ] Quantity badge appears in review
- [ ] Multiple images can be uploaded across reviews

### Registration
- [ ] Cannot see admin option in register
- [ ] Can register as Student
- [ ] Can register as Hostel Owner

---

## 🛠️ API Endpoints

### New Endpoints

**Admin Login**
```
POST /api/auth/admin-login
Body: {
  "username": "admin123",
  "password": "admin123"
}
Response: {
  "success": true,
  "token": "jwt_token_here",
  "admin": {
    "username": "admin123",
    "role": "admin"
  }
}
```

**Create Review with Image & Quantity**
```
POST /api/reviews
Headers: Authorization: Bearer {token}
Body: {
  "messId": "mess_id_here",
  "rating": 5,
  "hygieneRating": 4,
  "foodQualityRating": 5,
  "review": "Great food and clean place!",
  "quantity": "unlimited",
  "foodImage": "data:image/jpeg;base64,..."
}
```

---

## 📝 Notes

- Images are stored as base64 in the database
- Max image size: 10MB (includes entire request)
- Image preview works in real-time
- Dark mode works on all browsers
- Responsive design for mobile/tablet
- All hover effects are smooth transitions

---

## ❓ Troubleshooting

### Images not uploading?
- Check file size (must be < 5MB for practical use)
- Ensure image format is supported (JPG, PNG, GIF, WebP)
- Check browser console for errors

### Admin login not working?
- Verify credentials: admin123 / admin123
- Check backend server is running
- Clear localStorage and retry

### Dark mode looks wrong?
- Clear browser cache
- Try different browser
- Check developer tools for CSS errors

### Quantity field not showing?
- Ensure you're on mess-details.html
- Must be logged in to see review form
- Refresh page if not visible

---

## 🌟 Extraordinary Features Implemented

1. **Glassmorphic Design** - Modern frosted glass effect
2. **Text Hover Effects** - Color-changing text throughout
3. **Image Upload** - Food photos in reviews with preview
4. **Quantity Tracking** - Limited vs Unlimited food
5. **Dark Mode** - Complete dark theme
6. **Admin Portal** - Dedicated admin authentication
7. **Real-time Preview** - See image before upload
8. **Base64 Storage** - No file system needed
9. **Professional Design** - Modern and polished
10. **Responsive** - Works on all devices

---

## 📞 Support

For issues or questions:
1. Check DARK_MODE_IMPLEMENTATION.md for technical details
2. Review API documentation
3. Check browser console for errors
4. Verify backend is running on port 5000

---

**Version**: 2.0.0  
**Last Updated**: 31-01-2026  
**Status**: ✅ Ready to Use
