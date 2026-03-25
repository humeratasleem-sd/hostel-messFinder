const express = require('express');
const router = express.Router();
const {
  getAllMesses,
  getMessById,
  createMess,
  updateMess,
  deleteMess,
  getNearbyMesses,
  compareMesses,
  joinMess,
  leaveMess
} = require('../controllers/messController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAllMesses);
router.get('/nearby', getNearbyMesses);
router.get('/compare/:id1/:id2', compareMesses);

// Protected routes
router.get('/owner/my-mess', protect, async (req, res) => {
  try {
    const Mess = require('../models/Mess');
    const mess = await Mess.findOne({ ownerId: req.userId });
    
    if (!mess) {
      return res.status(404).json({
        success: false,
        message: 'No mess found'
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
});

router.get('/:id', getMessById);
router.post('/:id/join', protect, joinMess);
router.post('/:id/leave', protect, leaveMess);
router.post('/', protect, createMess);
router.put('/:id', protect, updateMess);
router.delete('/:id', protect, deleteMess);

module.exports = router;
