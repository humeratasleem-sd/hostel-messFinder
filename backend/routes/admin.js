const express = require('express');
const router = express.Router();
const { getAdminStats, getAdminLoginDetails, getAllUsers, getAllMesses, getAllReviews, getAnalytics } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/login-details', protect, adminOnly, getAdminLoginDetails);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/messes', protect, adminOnly, getAllMesses);
router.get('/reviews', protect, adminOnly, getAllReviews);
router.get('/analytics', protect, adminOnly, getAnalytics);

module.exports = router;
