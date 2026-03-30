require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDatabase = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const messRoutes = require('./routes/mess');
const reviewRoutes = require('./routes/review');

// Initialize app
const app = express();

// Connect to database
connectDatabase().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

// Middleware
app.use(cors({
  origin: true, // Allow all origins dynamically
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messes', messRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hostel Mess Finder API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve index.html for client-side routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// API 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Frontend fallback
app.use('*', (req, res) => {
  if (req.method !== 'GET') {
    return res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  }

  return res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
