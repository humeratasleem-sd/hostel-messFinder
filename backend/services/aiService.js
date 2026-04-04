/**
 * AI Service for Face Verification & Detection
 * Uses Google Cloud Vision API for human detection
 */

const vision = require('@google-cloud/vision');
const path = require('path');
const fs = require('fs');

// Create Vision API client with service account key
const keyFilePath = path.join(__dirname, '..', 'config', 'hostel-mess-ai-6f67d9e5fff7.json');

let visionClient;
try {
  visionClient = new vision.ImageAnnotatorClient({
    keyFilename: keyFilePath,
  });
  console.log('✅ Google Cloud Vision API client initialized successfully');
} catch (err) {
  console.error('❌ Failed to initialize Vision API client:', err.message);
  console.error('   Make sure the JSON key file exists at:', keyFilePath);
}

/**
 * Detect human in an image using Google Cloud Vision API
 * Works with both file paths and base64-encoded images
 */
exports.detectHumanFace = async (imageInput) => {
  console.log('--- AI FACE DETECTION (Google Vision) INITIATED ---');

  if (!imageInput) {
    return { hasFace: false, message: 'No photo provided' };
  }

  if (!visionClient) {
    return { hasFace: false, message: 'Vision API client not available. Check your credentials.' };
  }

  try {
    let request;

    // Check if input is a file path or base64 data
    if (imageInput.startsWith('data:image')) {
      // Base64 encoded image — extract the raw base64 content
      const base64Data = imageInput.replace(/^data:image\/\w+;base64,/, '');
      request = {
        image: { content: base64Data },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 15 },
          { type: 'FACE_DETECTION', maxResults: 5 },
        ],
      };
    } else if (fs.existsSync(imageInput)) {
      // Local file path
      const imageBuffer = fs.readFileSync(imageInput);
      request = {
        image: { content: imageBuffer.toString('base64') },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 15 },
          { type: 'FACE_DETECTION', maxResults: 5 },
        ],
      };
    } else {
      // Treat as URL
      request = {
        image: { source: { imageUri: imageInput } },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 15 },
          { type: 'FACE_DETECTION', maxResults: 5 },
        ],
      };
    }

    const [result] = await visionClient.annotateImage(request);

    // Check label annotations for person/human keywords
    const labels = result.labelAnnotations || [];
    const labelDescriptions = labels.map(l => l.description.toLowerCase());
    console.log('Vision API Labels:', labelDescriptions.join(', '));

    const humanKeywords = ['person', 'human', 'people', 'man', 'woman', 'boy', 'girl', 'face', 'selfie', 'portrait', 'head'];
    const hasPersonLabel = labelDescriptions.some(desc =>
      humanKeywords.some(keyword => desc.includes(keyword))
    );

    // Check face detection annotations
    const faces = result.faceAnnotations || [];
    const hasFaceDetection = faces.length > 0;

    console.log(`Label-based person: ${hasPersonLabel}, Face detection: ${hasFaceDetection} (${faces.length} faces)`);

    const hasFace = hasPersonLabel || hasFaceDetection;

    if (hasFace) {
      console.log('✅ Human face detected successfully via Google Vision API');
      return {
        hasFace: true,
        message: 'Human face detected',
        labels: labelDescriptions,
        faceCount: faces.length,
      };
    } else {
      console.log('❌ No human detected in the image');
      return {
        hasFace: false,
        message: 'No human face detected. Please upload a clear photo of a person.',
        labels: labelDescriptions,
        faceCount: 0,
      };
    }
  } catch (error) {
    console.error('Vision API Error:', error.message);
    return {
      hasFace: false,
      message: `Vision API error: ${error.message}`,
    };
  }
};

/**
 * Detect human in an uploaded file (used by the /api/vision/detect-human endpoint)
 */
exports.detectHumanFromFile = async (filePath) => {
  console.log('--- DETECT HUMAN FROM FILE ---');
  return exports.detectHumanFace(filePath);
};

/**
 * Real AI Face Verification (compare two faces)
 * Uses face-api.js for 128-d embedding extraction + strict comparison
 */
const { verifyFaces } = require('./faceVerificationService');

exports.verifyFace = async (studentPhotoBase64, ownerUploadedPhotoBase64) => {
  console.log('--- AI FACE VERIFICATION (STRICT) INITIATED ---');
  if (!studentPhotoBase64 || !ownerUploadedPhotoBase64) {
    return {
      match: false,
      score: 0,
      message: "Both photos are required for AI verification"
    };
  }

  try {
    const result = await verifyFaces(ownerUploadedPhotoBase64, studentPhotoBase64);

    return {
      match: result.result === 'Match',
      score: result.similarity ? Math.round(result.similarity * 100) : 0,
      message: result.result === 'Match'
        ? `Faces matched (distance: ${result.distance}, similarity: ${result.similarity})`
        : result.error || `Faces did not match (distance: ${result.distance}, similarity: ${result.similarity})`,
      details: {
        result: result.result,
        distance: result.distance,
        similarity: result.similarity,
        confidence: result.confidence,
      }
    };
  } catch (error) {
    console.error('Face verification error:', error.message);
    return {
      match: false,
      score: 0,
      message: `Face verification failed: ${error.message}`
    };
  }
};

/**
 * Mock Sentiment Analysis
 */
exports.analyzeSentiment = async (text) => {
  console.log('--- AI SENTIMENT ANALYSIS INITIATED ---');
  if (!text) return { score: 0, label: 'neutral' };

  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'delicious', 'clean', 'friendly', 'best', 'love', 'nice'];
  const negativeWords = ['bad', 'poor', 'terrible', 'worst', 'dirty', 'rude', 'unhygienic', 'expensive', 'hate', 'slow'];

  let score = 50;
  const words = text.toLowerCase().split(/\s+/);

  words.forEach(word => {
    if (positiveWords.includes(word)) score += 10;
    if (negativeWords.includes(word)) score -= 10;
  });

  score = Math.max(0, Math.min(100, score));
  let label = 'neutral';
  if (score > 65) label = 'positive';
  if (score < 35) label = 'negative';

  console.log(`Sentiment Result: ${label} (Score: ${score}%)`);
  return { score, label };
};

/**
 * Mock Fake Review & Spam Detection
 */
exports.detectFakeReview = async (text, userId, messId) => {
  console.log('--- AI FAKE REVIEW DETECTION INITIATED ---');
  if (!text) return { isFake: false, confidence: 0 };

  const spamPatterns = [
    /https?:\/\//i,
    /\b(buy|cheap|discount|offer|click here|subscribe)\b/i,
    /(.)\\1{4,}/,
  ];

  let spamScore = 0;
  spamPatterns.forEach(pattern => {
    if (pattern.test(text)) spamScore += 30;
  });

  if (text.length < 10) spamScore += 20;

  const commonSpamTemplates = [
    "this is a great mess",
    "i love the food here",
    "very bad experience",
    "the staff is very rude"
  ];
  if (commonSpamTemplates.includes(text.toLowerCase())) {
    spamScore += 50;
  }

  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  if (words.length > 5 && uniqueWords.size / words.length < 0.4) {
    spamScore += 40;
  }

  const isFake = spamScore > 50;
  console.log(`Fake Detection Result: ${isFake ? 'SUSPICIOUS' : 'GENUINE'} (Confidence: ${spamScore}%)`);

  return {
    isFake,
    confidence: spamScore,
    reason: isFake ? 'Spam patterns or high repetition detected' : 'Normal pattern'
  };
};

/**
 * Mock Suspicious User Behavior Flagging
 */
exports.flagSuspiciousBehavior = async (user) => {
  console.log('--- AI BEHAVIOR ANALYSIS INITIATED ---');
  return {
    isSuspicious: false,
    riskScore: 10,
    flags: []
  };
};
