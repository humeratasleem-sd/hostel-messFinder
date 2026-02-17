const Review = require('../models/Review');
const Mess = require('../models/Mess');

// @desc    Get all reviews for a mess
// @route   GET /api/reviews/mess/:messId
// @access  Public
exports.getReviewsByMess = async (req, res) => {
  try {
    const reviews = await Review.find({ messId: req.params.messId })
      .populate('userId', 'name college')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/user/my-reviews
// @access  Private
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.userId })
      .populate('messId', 'name location monthlyPrice foodType overallRating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { messId, rating, hygieneRating, foodQualityRating, review, quantity, foodImage, voiceNote } = req.body;

    // Validation
    if (!messId || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if mess exists
    const mess = await Mess.findById(messId);
    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    // Check if user already reviewed this mess
    const existingReview = await Review.findOne({
      userId: req.userId,
      messId: messId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this mess. Edit your existing review instead.'
      });
    }

    // Create review
    const newReview = await Review.create({
      userId: req.userId,
      messId: messId,
      rating,
      hygieneRating: hygieneRating || rating,
      foodQualityRating: foodQualityRating || rating,
      review,
      quantity: quantity || 'unlimited',
      foodImage: foodImage || null,
      voiceNote: voiceNote || null,
      verifiedStudent: true
    });

    await newReview.populate('userId', 'name college');

    res.status(201).json({
      success: true,
      data: newReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Update review
    review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name college');

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const messId = review.messId;
    await Review.findByIdAndDelete(req.params.reviewId);

    // Recalculate ratings
    await Review.calculateAverageRating(messId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// @desc    Get review count by mess
// @route   GET /api/reviews/stats/:messId
// @access  Public
exports.getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { messId: require('mongoose').Types.ObjectId(req.params.messId) } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || { totalReviews: 0, averageRating: 0 }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching review stats',
      error: error.message
    });
  }
};
