const express = require('express');
const router = express.Router();
const { getAdminStats, getAdminLoginDetails } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/login-details', protect, adminOnly, getAdminLoginDetails);

module.exports = router;
