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

// @desc    Get all users with analytics
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('name email role college loginCount lastLogin createdAt status')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate user statistics
    const totalUsers = users.length;
    const studentUsers = users.filter(u => u.role === 'student').length;
    const ownerUsers = users.filter(u => u.role === 'owner').length;
    const activeUsers = users.filter(u => u.lastLogin).length;

    res.status(200).json({
      success: true,
      users,
      analytics: {
        totalUsers,
        studentUsers,
        ownerUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Get all messes with analytics
// @route   GET /api/admin/messes
// @access  Private (Admin only)
exports.getAllMesses = async (req, res) => {
  try {
    const messes = await Mess.find()
      .populate('ownerId', 'name email')
      .select('name ownerId location overallRating totalReviews createdAt')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate mess statistics
    const totalMesses = messes.length;
    const verifiedMesses = totalMesses;
    const avgRating = messes.reduce((sum, m) => sum + (m.overallRating || 0), 0) / (totalMesses || 1);
    const totalReviews = messes.reduce((sum, m) => sum + (m.totalReviews || 0), 0);

    res.status(200).json({
      success: true,
      messes,
      analytics: {
        totalMesses,
        verifiedMesses,
        unverifiedMesses: totalMesses - verifiedMesses,
        avgRating: avgRating.toFixed(2),
        totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messes',
      error: error.message
    });
  }
};

// @desc    Get all reviews with analytics
// @route   GET /api/admin/reviews
// @access  Private (Admin only)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name email')
      .populate('messId', 'name')
      .select('userId messId rating review createdAt')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Calculate review statistics
    const allReviews = await Review.find().lean();
    const totalReviews = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / (totalReviews || 1);
    const ratingDistribution = {
      fiveStar: allReviews.filter(r => r.rating === 5).length,
      fourStar: allReviews.filter(r => r.rating === 4).length,
      threeStar: allReviews.filter(r => r.rating === 3).length,
      twoStar: allReviews.filter(r => r.rating === 2).length,
      oneStar: allReviews.filter(r => r.rating === 1).length
    };

    res.status(200).json({
      success: true,
      reviews,
      analytics: {
        totalReviews,
        avgRating: avgRating.toFixed(2),
        ratingDistribution
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Get comprehensive analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
exports.getAnalytics = async (req, res) => {
  try {
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      usersLast7Days,
      usersLast30Days,
      totalMesses,
      messesLast7Days,
      newMessesThisMonth,
      totalReviews,
      reviewsLast7Days,
      avgUserLoginCount,
      mobileUsers,
      webUsers
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: { $ne: 'admin' }, createdAt: { $gte: last7Days } }),
      User.countDocuments({ role: { $ne: 'admin' }, createdAt: { $gte: last30Days } }),
      Mess.countDocuments(),
      Mess.countDocuments({ createdAt: { $gte: last7Days } }),
      Mess.countDocuments({ createdAt: { $gte: last30Days } }),
      Review.countDocuments(),
      Review.countDocuments({ createdAt: { $gte: last7Days } }),
      User.aggregate([
        { $match: { role: { $ne: 'admin' } } },
        { $group: { _id: null, avgLogins: { $avg: '$loginCount' } } }
      ]),
      User.countDocuments({ role: { $ne: 'admin' }, isMobile: true }),
      User.countDocuments({ role: { $ne: 'admin' }, isMobile: false })
    ]);

    const avgLogins = avgUserLoginCount.length > 0 ? avgUserLoginCount[0].avgLogins.toFixed(2) : 0;

    res.status(200).json({
      success: true,
      userAnalytics: {
        totalUsers,
        usersLast7Days,
        usersLast30Days,
        avgUserLoginCount: avgLogins,
        mobileUsers,
        webUsers
      },
      messAnalytics: {
        totalMesses,
        messesLast7Days,
        newMessesThisMonth
      },
      reviewAnalytics: {
        totalReviews,
        reviewsLast7Days
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};
