const express = require('express');
const router = express.Router();
const {
  getReviewsByMess,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/mess/:messId', getReviewsByMess);
router.get('/stats/:messId', getReviewStats);

// Protected routes
router.post('/', protect, createReview);
router.get('/user/my-reviews', protect, getUserReviews);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;
