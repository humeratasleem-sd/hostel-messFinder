# Hostel Mess Finder - Frontend

## Quick Start

### 1. Run Locally
No build process needed! Just open in browser:

**Option A: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html`
- Select "Open with Live Server"
- Opens at `http://localhost:5500`

**Option B: Python HTTP Server**
```bash
python -m http.server 8000
# Navigate to http://localhost:8000
```

**Option C: Node http-server**
```bash
npm install -g http-server
http-server
# Navigate to http://localhost:8080
```

### 2. File Structure
```
frontend/
├── index.html              # Homepage
├── register.html           # Registration page
├── login.html              # Login page
├── messes.html             # Mess listing & search
├── mess-details.html       # Mess details & reviews
├── dashboard.html          # Student dashboard
├── css/
│   ├── styles.css         # Main styles
│   └── responsive.css     # Mobile responsive
└── js/
    ├── auth.js            # Authentication logic
    ├── main.js            # Homepage functionality
    ├── messes.js          # Mess listing & filtering
    ├── mess-details.js    # Reviews & ratings
    └── dashboard.js       # Dashboard functionality
```

## Backend Connection

Update API URLs in JavaScript files if backend runs on different port:

In `js/auth.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Pages Overview

### 1. Index (Home)
- Welcome section
- Features showcase
- How it works
- Statistics
- Call to action

### 2. Register
- Full name input
- Email (college email)
- Phone number (10 digits)
- College name
- Password with validation
- Form submission to backend

### 3. Login
- Email input
- Password input
- Remember token in localStorage
- Redirect to messes on success

### 4. Messes
- List all available messes
- **Search** by name/location (real-time)
- **Filter** by:
  - Food type (Veg/Non-Veg/Both)
  - Price range
  - Minimum rating
- Card-based UI with ratings
- Click to view details

### 5. Mess Details
- Full mess information
- Rating breakdown (food quality, hygiene)
- All student reviews
- **Review Form** (authenticated users only)
- Star rating widget (interactive)
- Edit/Delete own reviews
- One review per student enforcement

### 6. Dashboard
- Student profile view
- My reviews tab
- Review statistics
- Edit/Delete reviews
- Account settings

## Key Features

### Authentication
```javascript
// Token stored in localStorage
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));

// Included in API requests
fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Search & Filter
- Real-time search as you type
- Client-side filtering for instant results
- Multiple filter criteria
- Filter reset functionality

### Star Rating System
- Interactive 5-star selector
- Hover effects
- Click to select rating
- Display selected rating
- Separate ratings for:
  - Overall satisfaction
  - Food quality
  - Hygiene

### Responsive Design
- Mobile-first approach
- Flexbox & Grid layouts
- Touch-friendly buttons
- Readable font sizes
- Optimized for all screen sizes

## JavaScript Architecture

### auth.js
- JWT token management
- Navigation updates based on auth state
- Logout functionality
- Current user fetching

### main.js
- Homepage stats loading
- Mess/Review/User counts

### messes.js
- Fetch all messes
- Apply filters
- Real-time search
- Render mess cards
- Click handling

### mess-details.js
- Fetch mess details
- Load reviews
- Star rating setup
- Review submission
- Review editing/deletion

### dashboard.js
- Load user profile
- Fetch user reviews
- Tab switching
- Review editing modal
- Account management

## API Integration

### Fetch Pattern
```javascript
const response = await fetch(`${API_BASE_URL}/endpoint`, {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  headers: getAuthHeaders(),
  body: JSON.stringify(data)
});

const data = await response.json();
```

### Error Handling
```javascript
try {
  const response = await fetch(url);
  if (response.ok) {
    // Success
  } else {
    showError('Request failed');
  }
} catch (error) {
  showError('Network error: ' + error.message);
}
```

## Styling

### Color Scheme
- Primary: #ff6b6b (Red)
- Secondary: #4ecdc4 (Teal)
- Accent: #ffd93d (Gold)
- Text: #2d3436 (Dark Gray)
- Background: #f8f9fa (Light Gray)

### Components
- Cards with shadows
- Responsive navigation
- Modal dialogs
- Form inputs
- Buttons with hover effects
- Rating stars
- Badges

### Layouts
- Flexbox for navigation
- CSS Grid for mess cards
- Dashboard sidebar layout
- Modal overlays
- Responsive containers

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Tips
1. Lazy load images
2. Minimize API calls
3. Cache user data
4. Use client-side filtering
5. Optimize CSS selectors

## Security
- Never store passwords
- Validate input on client
- Use HTTPS in production
- Clear tokens on logout
- Validate API responses

## Deployment

### Netlify
1. Drag and drop `frontend` folder
2. Deploy automatically
3. Custom domain configuration

### Vercel
1. Push to GitHub
2. Connect Vercel
3. Select `frontend` directory
4. Auto-deploy on push

### GitHub Pages
1. Push to `gh-pages` branch
2. Enable GitHub Pages
3. Access at `username.github.io/repo`

## Troubleshooting

### API Connection Error
- Check backend is running on port 5000
- Verify API_BASE_URL in auth.js
- Check CORS settings on backend

### Styling Issues
- Clear browser cache (Ctrl+Shift+Del)
- Check CSS file paths are correct
- Verify responsive.css is loaded

### Authentication Issues
- Check localStorage for token
- Verify JWT_SECRET on backend matches
- Check token expiration time

### Star Rating Not Working
- Check stars have data-value attribute
- Verify event listeners attached
- Check CSS for star styling

---

**Made with ❤️ for college students**
