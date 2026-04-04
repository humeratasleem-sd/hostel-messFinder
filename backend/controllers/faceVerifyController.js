/**
 * Face Verification Controller
 * 
 * POST /api/vision/verify-face
 * Accepts: multipart/form-data with two fields:
 *   - ownerImage (file)
 *   - studentImage (file)
 * 
 * Returns strict verification result
 */

const { verifyFaces } = require('../services/faceVerificationService');
const fs = require('fs');

exports.verifyFace = async (req, res) => {
  const filesToCleanup = [];

  try {
    // Validate that both files were uploaded
    if (!req.files || !req.files.ownerImage || !req.files.studentImage) {
      return res.status(400).json({
        success: false,
        message: 'Both images are required. Upload "ownerImage" and "studentImage" as form-data fields.',
      });
    }

    const ownerFile = req.files.ownerImage[0];
    const studentFile = req.files.studentImage[0];

    filesToCleanup.push(ownerFile.path, studentFile.path);

    console.log(`\n🔐 Face Verification Request:`);
    console.log(`   Owner:   ${ownerFile.originalname} (${(ownerFile.size / 1024).toFixed(1)} KB)`);
    console.log(`   Student: ${studentFile.originalname} (${(studentFile.size / 1024).toFixed(1)} KB)`);

    // Run strict face verification
    const result = await verifyFaces(ownerFile.path, studentFile.path);

    // Build response
    const response = {
      success: true,
      result: result.result,
      distance: result.distance,
      similarity: result.similarity,
      confidence: result.confidence,
      processingTimeMs: result.processingTimeMs,
    };

    // Include error details if verification failed due to quality/detection issues
    if (result.error) {
      response.error = result.error;
    }

    // Include quality metrics if available
    if (result.ownerQuality || result.studentQuality) {
      response.qualityMetrics = {
        owner: result.ownerQuality || null,
        student: result.studentQuality || null,
      };
    }

    const statusCode = result.result === 'Match' ? 200 : 200; // Always 200 — result is in body
    res.status(statusCode).json(response);

  } catch (error) {
    console.error('Face Verification Error:', error);
    res.status(500).json({
      success: false,
      result: 'Not Match',
      distance: null,
      similarity: null,
      confidence: 'Low',
      message: 'Internal error during face verification',
      error: error.message,
    });

  } finally {
    // Cleanup uploaded files
    for (const filePath of filesToCleanup) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (e) {
        console.warn('Cleanup warning:', e.message);
      }
    }
  }
};
