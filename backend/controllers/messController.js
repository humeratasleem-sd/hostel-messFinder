const Mess = require('../models/Mess');

// @desc    Get all messes
// @route   GET /api/messes
// @access  Public
exports.getAllMesses = async (req, res) => {
  try {
    const { search, priceMin, priceMax, foodType, ratingMin } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (priceMin || priceMax) {
      filter.monthlyPrice = {};
      if (priceMin) filter.monthlyPrice.$gte = Number(priceMin);
      if (priceMax) filter.monthlyPrice.$lte = Number(priceMax);
    }

    if (foodType) {
      filter.foodType = foodType;
    }

    if (ratingMin) {
      filter.overallRating = { $gte: Number(ratingMin) };
    }

    const messes = await Mess.find(filter).populate('ownerId', 'name email phone').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messes.length,
      data: messes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messes',
      error: error.message
    });
  }
};

// @desc    Get single mess by ID
// @route   GET /api/messes/:id
// @access  Public
exports.getMessById = async (req, res) => {
  try {
    const mess = await Mess.findById(req.params.id).populate('ownerId', 'name email phone');

    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    res.status(200).json({
      success: true,
      data: mess
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mess',
      error: error.message
    });
  }
};

// @desc    Create new mess
// @route   POST /api/messes
// @access  Private (Owner only)
exports.createMess = async (req, res) => {
  try {
    const { name, location, address, monthlyPrice, foodType, description, phoneNumber, website, capacity, facilities, foodSchedule } = req.body;

    if (!name || !location || monthlyPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if owner already has a mess
    const existingMess = await Mess.findOne({ ownerId: req.userId });
    if (existingMess) {
      return res.status(400).json({
        success: false,
        message: 'You already have a mess listed. Please edit your existing mess.'
      });
    }

    const messData = {
      name,
      location,
      address: address || location,
      monthlyPrice,
      foodType: foodType || 'Both',
      description,
      phoneNumber,
      website,
      capacity,
      facilities: facilities || [],
      ownerId: req.userId
    };

    // Add food schedule if provided
    if (foodSchedule) {
      messData.foodSchedule = foodSchedule;
    }

    const mess = await Mess.create(messData);

    // Update user with messOwnedId
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.userId, { messOwnedId: mess._id });

    res.status(201).json({
      success: true,
      data: mess
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating mess',
      error: error.message
    });
  }
};

// @desc    Update mess
// @route   PUT /api/messes/:id
// @access  Private (Admin only)
exports.updateMess = async (req, res) => {
  try {
    const mess = await Mess.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    res.status(200).json({
      success: true,
      data: mess
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating mess',
      error: error.message
    });
  }
};

// @desc    Delete mess
// @route   DELETE /api/messes/:id
// @access  Private (Admin only)
exports.deleteMess = async (req, res) => {
  try {
    const mess = await Mess.findByIdAndDelete(req.params.id);

    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mess deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting mess',
      error: error.message
    });
  }
};

// @desc    Get nearby messes by coordinates
// @route   GET /api/messes/nearby
// @access  Public
exports.getNearbyMesses = async (req, res) => {
  try {
    const { latitude, longitude, distance } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Distance in meters (default 5km)
    const maxDistance = distance ? Number(distance) * 1000 : 5000;

    const messes = await Mess.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)]
          },
          $maxDistance: maxDistance
        }
      }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messes.length,
      data: messes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby messes',
      error: error.message
    });
  }
};

// @desc    Compare two messes
// @route   GET /api/messes/compare/:id1/:id2
// @access  Public
exports.compareMesses = async (req, res) => {
  try {
    const { id1, id2 } = req.params;

    const mess1 = await Mess.findById(id1);
    const mess2 = await Mess.findById(id2);

    if (!mess1 || !mess2) {
      return res.status(404).json({
        success: false,
        message: 'One or both messes not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        mess1,
        mess2
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error comparing messes',
      error: error.message
    });
  }
};

// @desc    Join a mess as a student
// @route   POST /api/messes/:id/join
// @access  Private (Student only)
exports.joinMess = async (req, res) => {
  try {
    const messId = req.params.id;
    const studentId = req.userId;

    // Check if mess exists and populate owner
    const mess = await Mess.findById(messId).populate('ownerId', 'name email phone');
    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    // Check if student already joined a mess
    const User = require('../models/User');
    const student = await User.findById(studentId);
    if (student.joinedMessId && student.joinedMessId.toString() !== messId) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined another mess. Please leave it first.'
      });
    }

    // Check if student already joined this mess
    if (mess.joinedStudents.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this mess'
      });
    }

    // Add student to joined students list
    mess.joinedStudents.push(studentId);
    await mess.save();

    // Update student's joinedMessId
    student.joinedMessId = messId;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Successfully joined the mess',
      data: {
        messId: mess._id,
        messName: mess.name,
        ownerDetails: {
          id: mess.ownerId._id,
          name: mess.ownerId.name,
          email: mess.ownerId.email,
          phone: mess.ownerId.phone
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error joining mess',
      error: error.message
    });
  }
};

// @desc    Leave a mess
// @route   POST /api/messes/:id/leave
// @access  Private (Student only)
exports.leaveMess = async (req, res) => {
  try {
    const messId = req.params.id;
    const studentId = req.userId;

    // Check if mess exists
    const mess = await Mess.findById(messId);
    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'Mess not found'
      });
    }

    // Check if student is part of this mess
    if (!mess.joinedStudents.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this mess'
      });
    }

    // Remove student from joined students list
    mess.joinedStudents = mess.joinedStudents.filter(id => id.toString() !== studentId.toString());
    await mess.save();

    // Clear student's joinedMessId
    const User = require('../models/User');
    const student = await User.findById(studentId);
    student.joinedMessId = null;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Successfully left the mess'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error leaving mess',
      error: error.message
    });
  }
};
