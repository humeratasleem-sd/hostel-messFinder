#!/bin/bash

# Hostel Mess Finder - Complete Project Structure

# Create comprehensive project documentation
cat > PROJECT_FILES.md << 'EOF'
# 📁 Project Files & Structure

## Complete File Listing

### Root Directory Files
```
├── README.md                    # Main project documentation
├── QUICKSTART.md               # 5-minute quick start guide
├── SETUP_GUIDE.md              # Detailed setup instructions
├── CONFIG.md                   # Configuration guide
├── API_TESTING.md              # API testing examples
└── PROJECT_FILES.md            # This file
```

## Backend Files

### Configuration Files
```
backend/
├── package.json                # Dependencies and scripts
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
└── seed.js                    # Database seeding script
```

### Main Server
```
backend/
└── server.js                  # Express app entry point
```

### Database & Configuration
```
backend/config/
└── database.js                # MongoDB connection setup
```

### Database Models
```
backend/models/
├── User.js                    # Student user schema
├── Mess.js                    # Mess facility schema
└── Review.js                  # Review & rating schema
```

### API Controllers
```
backend/controllers/
├── authController.js          # Auth logic (register, login)
├── messController.js          # Mess CRUD operations
└── reviewController.js        # Review CRUD operations
```

### API Routes
```
backend/routes/
├── auth.js                    # /api/auth routes
├── mess.js                    # /api/messes routes
└── review.js                  # /api/reviews routes
```

### Middleware
```
backend/middleware/
└── auth.js                    # JWT token verification
```

### Documentation
```
backend/
└── README.md                  # Backend-specific docs
```

## Frontend Files

### HTML Pages
```
frontend/
├── index.html                 # Home page
├── register.html              # Registration page
├── login.html                 # Login page
├── messes.html                # Mess listing & search
├── mess-details.html          # Mess details & reviews
└── dashboard.html             # Student dashboard
```

### CSS Styling
```
frontend/css/
├── styles.css                 # Main styles & components
└── responsive.css             # Mobile responsive design
```

### JavaScript
```
frontend/js/
├── auth.js                    # Authentication & navigation
├── main.js                    # Homepage functionality
├── messes.js                  # Mess listing & filtering
├── mess-details.js            # Review system
└── dashboard.js               # Dashboard functionality
```

### Configuration
```
frontend/
├── .gitignore                 # Git ignore rules
└── README.md                  # Frontend-specific docs
```

## File Count Summary

**Backend:**
- 3 Model files
- 3 Controller files  
- 3 Route files
- 1 Middleware file
- 1 Configuration file
- 3 Config files (package.json, seed.js, .env.example)

**Total Backend: 14 files**

**Frontend:**
- 6 HTML pages
- 2 CSS files
- 5 JavaScript files
- 2 Config files (.gitignore, README.md)

**Total Frontend: 15 files**

**Documentation:**
- 1 Main README
- 1 Quick Start
- 1 Setup Guide
- 1 Config Guide
- 1 API Testing
- 1 This file

**Total Documentation: 6 files**

**Grand Total: 35+ files**

---

## Key Architecture Points

### Backend Architecture
```
Request → Router → Controller → Model → Database
                ↓
         JWT Middleware (protected routes)
                ↓
            Response
```

### Database Schema Relationships
```
User (1) ──→ (Many) Review
Mess  (1) ──→ (Many) Review
```

### Frontend Architecture
```
HTML Pages → CSS Styling → JavaScript Logic → Fetch API → Backend
                         ↓
                    LocalStorage (tokens)
```

### API Endpoints
```
/api/auth
  ├── POST /register
  ├── POST /login
  └── GET /me

/api/messes
  ├── GET / (with filters)
  ├── GET /:id
  ├── POST / (protected)
  ├── PUT /:id (protected)
  └── DELETE /:id (protected)

/api/reviews
  ├── GET /mess/:messId
  ├── GET /user/my-reviews (protected)
  ├── POST / (protected)
  ├── PUT /:reviewId (protected)
  └── DELETE /:reviewId (protected)
```

---

## Development Workflow

### 1. Backend Development
- Edit files in `backend/`
- Server auto-reloads with nodemon
- Test with cURL or Postman
- Check logs in terminal

### 2. Frontend Development
- Edit files in `frontend/`
- Refresh browser to see changes
- Use browser DevTools (F12)
- Check Console, Network, Application tabs

### 3. Database Management
- Use MongoDB Atlas UI for viewing data
- Run `node seed.js` to populate sample data
- Check data with MongoDB Compass (optional)

---

## Important Files to Know

### Must Read
1. **README.md** - Complete project overview
2. **QUICKSTART.md** - Get running in 5 minutes
3. **SETUP_GUIDE.md** - Detailed setup instructions

### Configuration
1. **backend/.env** - Backend secrets (create this!)
2. **backend/package.json** - Dependencies
3. **frontend/js/auth.js** - API URL configuration

### Most Critical Code
1. **backend/server.js** - Entry point, must run
2. **backend/models/** - Database schemas
3. **frontend/index.html** - App entry point

---

## File Sizes (Approximate)

| File | Size | Purpose |
|------|------|---------|
| styles.css | 15KB | Frontend styling |
| responsive.css | 8KB | Mobile styles |
| auth.js | 3KB | Auth logic |
| messes.js | 4KB | Mess listing |
| messController.js | 3KB | Mess endpoints |
| authController.js | 3KB | Auth endpoints |
| User.js | 2KB | User model |
| Review.js | 3KB | Review model |

**Total Size:** ~50KB (very lightweight!)

---

## Code Statistics

**Backend Lines of Code:**
- Models: ~150 lines
- Controllers: ~250 lines
- Routes: ~50 lines
- Middleware: ~30 lines
- Server: ~50 lines
- **Total: ~530 lines**

**Frontend Lines of Code:**
- HTML: ~500 lines
- CSS: ~700 lines
- JavaScript: ~400 lines
- **Total: ~1600 lines**

**Total Project: ~2130 lines of code**

---

## Security Features by File

### auth.js (Backend Middleware)
✓ JWT token verification
✓ Protected route enforcement

### authController.js
✓ Bcrypt password hashing
✓ JWT token generation
✓ Input validation

### User.js (Model)
✓ Password pre-save hashing
✓ Password matching method
✓ Email uniqueness constraint

### Review.js (Model)
✓ One-review-per-student enforcement
✓ User ID verification
✓ Automatic rating calculations

### auth.js (Frontend)
✓ Token storage management
✓ Authorization header setup
✓ Protected route navigation

---

## Performance Optimizations

### Backend
- Database indexing on queries
- Select specific fields (not all data)
- Efficient filtering at database level
- Token-based auth (no session storage)

### Frontend
- Client-side filtering for instant UX
- Vanilla JS (no framework overhead)
- CSS Grid/Flexbox (native browser speed)
- LocalStorage for token (no cookies overhead)

---

## Deployment Checklist

- [ ] Update .env with production values
- [ ] Change JWT_SECRET to strong random key
- [ ] Use MongoDB Atlas URI
- [ ] Set NODE_ENV=production
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test review creation
- [ ] Mobile responsiveness check
- [ ] Deploy backend (Render/Railway)
- [ ] Deploy frontend (Netlify/Vercel)
- [ ] Update frontend API URL
- [ ] Test production site
- [ ] Monitor logs and errors

---

## Contributing Guidelines

### Adding Features
1. Create feature branch
2. Add files following existing structure
3. Follow code style (camelCase, meaningful names)
4. Add comments for complex logic
5. Test thoroughly
6. Update documentation
7. Create pull request

### File Naming Conventions
- Models: `PascalCase.js` (User.js, Mess.js)
- Controllers: `camelCaseController.js` (authController.js)
- Routes: `camelCase.js` (auth.js)
- Frontend JS: `camelCase.js` (auth.js, main.js)
- CSS: `camelCase.css` (styles.css)
- HTML: `kebab-case.html` (mess-details.html)

---

## Version Control

### .gitignore Files Included
```
backend/.gitignore
- node_modules/
- .env (secrets)
- *.log files
- IDE configs

frontend/.gitignore
- .DS_Store
- build/dist folders
- IDE configs
```

### Recommended Git Workflow
```bash
# Main branch - production ready
main/

# Development branch
develop/

# Feature branches
feature/auth
feature/reviews
feature/search
```

---

## Documentation Files Explained

| File | Purpose | Read Time |
|------|---------|-----------|
| README.md | Complete guide | 20 min |
| QUICKSTART.md | Get running fast | 5 min |
| SETUP_GUIDE.md | Detailed setup | 15 min |
| CONFIG.md | Configuration | 5 min |
| API_TESTING.md | API examples | 10 min |
| This file | Project structure | 10 min |

**Total: ~65 minutes of reading**

---

## File Dependencies

### Backend Dependencies
```
server.js
├── config/database.js
├── routes/auth.js
│   └── controllers/authController.js
│       └── models/User.js
├── routes/mess.js
│   └── controllers/messController.js
│       └── models/Mess.js
├── routes/review.js
│   └── controllers/reviewController.js
│       └── models/Review.js
└── middleware/auth.js
```

### Frontend Dependencies
```
HTML Pages
├── css/styles.css
├── css/responsive.css
└── js/
    ├── auth.js
    ├── main.js
    ├── messes.js
    ├── mess-details.js
    └── dashboard.js
```

---

## Next Steps

1. **Setup**: Follow QUICKSTART.md
2. **Understand**: Read README.md
3. **Deploy**: Use deployment guides
4. **Contribute**: Follow guidelines
5. **Scale**: Add new features

---

**Project Status:** ✅ Production Ready
**Last Updated:** January 28, 2026
**Version:** 1.0.0

EOF

echo "✅ PROJECT_FILES.md created successfully!"
