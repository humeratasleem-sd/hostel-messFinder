const aiService = require('../services/aiService');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Detect human in an uploaded image
 * @route   POST /api/vision/detect-human
 * @access  Public (can be protected if needed)
 *
 * Accepts:
 *   - multipart/form-data with field "image" (file upload)
 *   - application/json with field "image" (base64 string)
 */
exports.detectHuman = async (req, res) => {
  try {
    let result;

    if (req.file) {
      // File was uploaded via multer
      console.log('Vision API: Processing uploaded file:', req.file.path);
      result = await aiService.detectHumanFromFile(req.file.path);

      // Cleanup: delete the uploaded file after processing
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.warn('Could not delete temp file:', e.message);
      }
    } else if (req.body && req.body.image) {
      // Base64 image sent in JSON body
      console.log('Vision API: Processing base64 image');
      result = await aiService.detectHumanFace(req.body.image);
    } else {
      return res.status(400).json({
        success: false,
        message: 'No image provided. Upload a file or send a base64 image string.',
      });
    }

    res.status(200).json({
      success: true,
      containsHuman: result.hasFace,
      message: result.message,
      details: {
        labels: result.labels || [],
        faceCount: result.faceCount || 0,
      },
    });
  } catch (error) {
    console.error('Vision Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing image',
      error: error.message,
    });
  }
};
