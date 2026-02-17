const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, adminLogin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);

// Protected routes
router.get('/me', protect, getCurrentUser);

module.exports = router;
