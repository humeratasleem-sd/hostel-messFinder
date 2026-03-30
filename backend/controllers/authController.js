const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_development';

  return jwt.sign({ id }, secret, {
    expiresIn: '30d'
  });
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, phone, college, password, role } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate role and college requirement
    const validRoles = ['student', 'owner', 'hostel_owner'];
    const userRole = role === 'owner' ? 'hostel_owner' : (role || 'student');
    
    // College is required for students
    if (userRole === 'student' && !college) {
      return res.status(400).json({
        success: false,
        message: 'College name is required for students'
      });
    }
    
    if (!validRoles.includes(userRole) && userRole !== 'student') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    user = await User.create({
      name,
      email,
      phone,
      college,
      password,
      role: userRole
    });

    const token = generateToken(user._id);
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      role: user.role
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userData,
      data: { user: userData }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in registration: ' + error.message
    });
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user and password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Login doesn't require userType validation from frontend anymore
    // Role is automatically returned to frontend from user object
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    await User.findByIdAndUpdate(user._id, {
      $inc: { loginCount: 1 },
      $set: { lastLogin: new Date() }
    });

    const token = generateToken(user._id);
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      role: user.role
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData,
      data: { user: userData }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in login: ' + error.message
    });
  }
};

// @desc    Admin Login
// @route   POST /api/auth/admin-login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Normalize email completely
    email = email.trim().toLowerCase();
    console.log(`[Admin Login Attempt] Email: ${email}`);

    // Check if admin user exists
    const admin = await User.findOne({ email, role: 'admin' }).select('+password');
    console.log(`[Admin Login Check] Found admin in DB:`, !!admin);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Verify password
    const isMatch = await admin.matchPassword(password);
    console.log(`[Admin Login Check] Password match:`, isMatch);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    await User.findByIdAndUpdate(admin._id, {
      $inc: { loginCount: 1 },
      $set: { lastLogin: new Date() }
    });

    // Generate token for admin
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development';

    const token = jwt.sign({
      id: admin._id,
      isAdmin: true, 
      email: admin.email 
    }, secret, {
      expiresIn: '30d'
    });

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in admin login: ' + error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
};
