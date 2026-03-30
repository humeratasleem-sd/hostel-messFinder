const express = require('express');
const router = express.Router();
const {
  getAllMesses,
  getMessById,
  getOwnerMess,
  createMess,
  updateMess,
  deleteMess,
  getNearbyMesses,
  compareMesses,
  joinMess,
  leaveMess
} = require('../controllers/messController');
const { protect } = require('../middleware/auth');

// ===== PUBLIC ROUTES =====
router.get('/', getAllMesses);

// ===== SPECIFIC ROUTES (must come before :id) =====
router.get('/nearby', getNearbyMesses);
router.get('/compare/:id1/:id2', compareMesses);

// ===== PROTECTED ROUTES =====
// Owner routes
router.get('/owner/my-mess', protect, getOwnerMess);

// Student routes
router.post('/:id/join', protect, joinMess);
router.post('/:id/leave', protect, leaveMess);

// Mess management (owner only)
router.post('/', protect, createMess);
router.put('/:id', protect, updateMess);
router.delete('/:id', protect, deleteMess);

// ===== GENERIC ROUTE (must be last) =====
router.get('/:id', getMessById);

module.exports = router;
