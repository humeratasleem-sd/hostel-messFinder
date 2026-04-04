const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { detectHuman } = require('../controllers/visionController');
const { verifyFace } = require('../controllers/faceVerifyController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'vision-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|bmp/;
    const extOk = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowedTypes.test(file.mimetype);
    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP, BMP) are allowed'));
    }
  },
});

// POST /api/vision/detect-human — single image human detection
router.post('/detect-human', upload.single('image'), detectHuman);

// POST /api/vision/verify-face — strict face verification (two images)
router.post(
  '/verify-face',
  upload.fields([
    { name: 'ownerImage', maxCount: 1 },
    { name: 'studentImage', maxCount: 1 },
  ]),
  verifyFace
);

module.exports = router;
