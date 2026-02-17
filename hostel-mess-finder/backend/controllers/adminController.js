const User = require('../models/User');
const Mess = require('../models/Mess');
const Review = require('../models/Review');

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getAdminStats = async (req, res) => {
  try {
    const [registrations, messes, reviews, loginAgg] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Mess.countDocuments(),
      Review.countDocuments(),
      User.aggregate([
        { $match: { role: { $ne: 'admin' } } },
        { $group: { _id: null, total: { $sum: '$loginCount' } } }
      ])
    ]);

    const logins = loginAgg.length > 0 ? loginAgg[0].total : 0;

    res.status(200).json({
      success: true,
      registrations,
      logins,
      messes,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin statistics',
      error: error.message
    });
  }
};
