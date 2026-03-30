const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.warn('protect - No token provided');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development';
    const decoded = jwt.verify(token, secret);
    console.log('protect - Token decoded, userId:', decoded.id);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('protect - JWT verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('role');
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying admin access'
    });
  }
};

module.exports = { protect, adminOnly };
