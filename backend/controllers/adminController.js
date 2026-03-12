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

// @desc    Get login details for admin dashboard
// @route   GET /api/admin/login-details
// @access  Private (Admin only)
exports.getAdminLoginDetails = async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      currentAdmin,
      recentLogins,
      mostActiveUsers,
      usersWithAtLeastOneLogin,
      neverLoggedIn,
      activeLast24h
    ] = await Promise.all([
      User.findById(req.userId)
        .select('name email role loginCount lastLogin createdAt')
        .lean(),
      User.find({ lastLogin: { $ne: null } })
        .select('name email role loginCount lastLogin')
        .sort({ lastLogin: -1 })
        .limit(20)
        .lean(),
      User.find({ loginCount: { $gt: 0 } })
        .select('name email role loginCount lastLogin')
        .sort({ loginCount: -1 })
        .limit(5)
        .lean(),
      User.countDocuments({ loginCount: { $gt: 0 } }),
      User.countDocuments({ $or: [{ loginCount: { $exists: false } }, { loginCount: 0 }] }),
      User.countDocuments({ lastLogin: { $gte: last24Hours } })
    ]);

    res.status(200).json({
      success: true,
      session: {
        name: currentAdmin?.name || 'Admin',
        email: currentAdmin?.email || '',
        role: currentAdmin?.role || 'admin',
        loginCount: currentAdmin?.loginCount || 0,
        lastLogin: currentAdmin?.lastLogin || null,
        createdAt: currentAdmin?.createdAt || null
      },
      loginSummary: {
        usersWithAtLeastOneLogin,
        neverLoggedIn,
        activeLast24h
      },
      recentLogins,
      mostActiveUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching login details',
      error: error.message
    });
  }
};
