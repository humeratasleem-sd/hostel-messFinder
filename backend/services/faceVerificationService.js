/**
 * Face Verification Service — STRICT MODE
 * 
 * Uses face-api.js for:
 * - Face detection (SSD MobileNet V1)
 * - 68-point facial landmark detection (quality & pose checks)
 * - 128-dimensional face descriptor extraction (FaceNet-style embeddings)
 * 
 * Quality checks: blur, face size, head pose, brightness
 * Comparison: Euclidean Distance + Cosine Similarity (both must pass)
 */

const faceapi = require('face-api.js');
const canvas = require('canvas');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Patch face-api.js to work in Node.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// ──────────────────────────────────────────────
// Configuration
// ──────────────────────────────────────────────
const MODELS_PATH = path.join(__dirname, '..', 'models', 'face-api');

const QUALITY_THRESHOLDS = {
  MIN_FACE_WIDTH: 80,         // minimum face width in pixels
  MIN_FACE_HEIGHT: 80,        // minimum face height in pixels
  MIN_BLUR_SCORE: 50,         // laplacian variance — below = blurry
  MAX_YAW_ANGLE: 30,          // degrees — max horizontal head turn
  MAX_PITCH_ANGLE: 30,        // degrees — max vertical head tilt
  MIN_BRIGHTNESS: 40,         // mean pixel value — below = too dark
  MAX_BRIGHTNESS: 250,        // mean pixel value — above = overexposed
};

const MATCH_THRESHOLDS = {
  MAX_EUCLIDEAN_DISTANCE: 0.45,
  MIN_COSINE_SIMILARITY: 0.75,
};

let modelsLoaded = false;

// ──────────────────────────────────────────────
// Model Loading
// ──────────────────────────────────────────────
async function loadModels() {
  if (modelsLoaded) return;

  console.log('🔄 Loading face-api.js models...');
  const startTime = Date.now();

  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
    console.log('  ✅ SSD MobileNet V1 (face detection)');

    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);
    console.log('  ✅ Face Landmark 68 (landmark detection)');

    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);
    console.log('  ✅ Face Recognition Net (128-d embeddings)');

    modelsLoaded = true;
    console.log(`✅ All models loaded in ${Date.now() - startTime}ms`);
  } catch (err) {
    console.error('❌ Failed to load face-api.js models:', err.message);
    console.error('   Run: node scripts/downloadModels.js');
    throw new Error('Face verification models not available. Run: node scripts/downloadModels.js');
  }
}

// ──────────────────────────────────────────────
// Image Loading
// ──────────────────────────────────────────────
async function loadImage(input) {
  let buffer;

  if (Buffer.isBuffer(input)) {
    buffer = input;
  } else if (typeof input === 'string') {
    if (input.startsWith('data:image')) {
      // Base64 data URI
      const base64Data = input.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
    } else if (fs.existsSync(input)) {
      // File path
      buffer = fs.readFileSync(input);
    } else {
      throw new Error('Invalid image input: not a valid file path or base64 string');
    }
  } else {
    throw new Error('Invalid image input type');
  }

  // Normalize image to PNG using sharp (handles JPEG, WebP, etc.)
  const normalized = await sharp(buffer)
    .png()
    .toBuffer();

  const img = await canvas.loadImage(normalized);
  return { img, buffer: normalized };
}

// ──────────────────────────────────────────────
// Quality Checks
// ──────────────────────────────────────────────

/**
 * Estimate blur using Laplacian variance on the face region
 */
async function computeBlurScore(imageBuffer, faceBox) {
  try {
    const { x, y, width, height } = faceBox;

    // Extract the face region
    const faceRegion = await sharp(imageBuffer)
      .extract({
        left: Math.max(0, Math.round(x)),
        top: Math.max(0, Math.round(y)),
        width: Math.max(1, Math.round(width)),
        height: Math.max(1, Math.round(height)),
      })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = faceRegion;
    const w = info.width;
    const h = info.height;

    // Laplacian kernel convolution: [0, 1, 0; 1, -4, 1; 0, 1, 0]
    let sum = 0;
    let sumSq = 0;
    let count = 0;

    for (let row = 1; row < h - 1; row++) {
      for (let col = 1; col < w - 1; col++) {
        const center = data[row * w + col];
        const top = data[(row - 1) * w + col];
        const bottom = data[(row + 1) * w + col];
        const left = data[row * w + (col - 1)];
        const right = data[row * w + (col + 1)];

        const laplacian = -4 * center + top + bottom + left + right;
        sum += laplacian;
        sumSq += laplacian * laplacian;
        count++;
      }
    }

    if (count === 0) return 0;

    const mean = sum / count;
    const variance = sumSq / count - mean * mean;

    return variance;
  } catch (err) {
    console.warn('Blur detection error:', err.message);
    return 0; // fail-safe: treat as blurry
  }
}

/**
 * Compute mean brightness of the face region
 */
async function computeBrightness(imageBuffer, faceBox) {
  try {
    const { x, y, width, height } = faceBox;

    const faceRegion = await sharp(imageBuffer)
      .extract({
        left: Math.max(0, Math.round(x)),
        top: Math.max(0, Math.round(y)),
        width: Math.max(1, Math.round(width)),
        height: Math.max(1, Math.round(height)),
      })
      .greyscale()
      .raw()
      .toBuffer();

    let sum = 0;
    for (let i = 0; i < faceRegion.length; i++) {
      sum += faceRegion[i];
    }

    return sum / faceRegion.length;
  } catch (err) {
    console.warn('Brightness check error:', err.message);
    return 0;
  }
}

/**
 * Estimate head pose (yaw and pitch) from 68-point landmarks
 * Uses nose tip, left/right eye centers, and chin position
 */
function estimateHeadPose(landmarks) {
  const positions = landmarks.positions;

  // Key points
  const noseTip = positions[30];       // Nose tip
  const leftEye = positions[36];       // Left eye outer corner
  const rightEye = positions[45];      // Right eye outer corner
  const chin = positions[8];           // Chin bottom
  const foreHead = positions[27];      // Bridge of nose (top)

  // Yaw estimation: compare nose horizontal position relative to eye centers
  const eyeCenterX = (leftEye.x + rightEye.x) / 2;
  const eyeWidth = Math.abs(rightEye.x - leftEye.x);

  if (eyeWidth < 1) return { yaw: 0, pitch: 0 };

  const noseOffset = noseTip.x - eyeCenterX;
  const yawRatio = noseOffset / (eyeWidth / 2);
  const yaw = Math.abs(yawRatio) * 45; // approximate degrees

  // Pitch estimation: compare vertical distances
  const eyeCenterY = (leftEye.y + rightEye.y) / 2;
  const noseToEye = noseTip.y - eyeCenterY;
  const chinToEye = chin.y - eyeCenterY;

  if (chinToEye < 1) return { yaw, pitch: 0 };

  const pitchRatio = noseToEye / chinToEye;
  // Normal ratio is ~0.4-0.5; deviations indicate pitch
  const normalRatio = 0.45;
  const pitch = Math.abs(pitchRatio - normalRatio) * 90;

  return {
    yaw: Math.round(yaw * 10) / 10,
    pitch: Math.round(pitch * 10) / 10,
  };
}

/**
 * Run all quality checks on a detected face
 */
async function runQualityChecks(imageBuffer, detection) {
  const issues = [];

  const box = detection.detection.box;

  // 1. Face size check
  if (box.width < QUALITY_THRESHOLDS.MIN_FACE_WIDTH || box.height < QUALITY_THRESHOLDS.MIN_FACE_HEIGHT) {
    issues.push(`Face too small (${Math.round(box.width)}x${Math.round(box.height)}px, need ${QUALITY_THRESHOLDS.MIN_FACE_WIDTH}x${QUALITY_THRESHOLDS.MIN_FACE_HEIGHT}px minimum)`);
  }

  // 2. Blur check
  const blurScore = await computeBlurScore(imageBuffer, box);
  if (blurScore < QUALITY_THRESHOLDS.MIN_BLUR_SCORE) {
    issues.push(`Face is blurry (sharpness: ${blurScore.toFixed(1)}, need >${QUALITY_THRESHOLDS.MIN_BLUR_SCORE})`);
  }

  // 3. Brightness check
  const brightness = await computeBrightness(imageBuffer, box);
  if (brightness < QUALITY_THRESHOLDS.MIN_BRIGHTNESS) {
    issues.push(`Image too dark (brightness: ${brightness.toFixed(1)}, need >${QUALITY_THRESHOLDS.MIN_BRIGHTNESS})`);
  }
  if (brightness > QUALITY_THRESHOLDS.MAX_BRIGHTNESS) {
    issues.push(`Image overexposed (brightness: ${brightness.toFixed(1)}, need <${QUALITY_THRESHOLDS.MAX_BRIGHTNESS})`);
  }

  // 4. Head pose check
  if (detection.landmarks) {
    const pose = estimateHeadPose(detection.landmarks);
    if (pose.yaw > QUALITY_THRESHOLDS.MAX_YAW_ANGLE) {
      issues.push(`Face not front-facing — yaw: ${pose.yaw}° (max ${QUALITY_THRESHOLDS.MAX_YAW_ANGLE}°)`);
    }
    if (pose.pitch > QUALITY_THRESHOLDS.MAX_PITCH_ANGLE) {
      issues.push(`Face not front-facing — pitch: ${pose.pitch}° (max ${QUALITY_THRESHOLDS.MAX_PITCH_ANGLE}°)`);
    }
  }

  return {
    passed: issues.length === 0,
    issues,
    metrics: {
      faceSize: `${Math.round(box.width)}x${Math.round(box.height)}`,
      blurScore: blurScore.toFixed(1),
      brightness: brightness.toFixed(1),
    },
  };
}

// ──────────────────────────────────────────────
// Face Detection & Embedding
// ──────────────────────────────────────────────

/**
 * Detect single face, validate quality, extract embedding
 * Returns: { success, descriptor, qualityReport, error }
 */
async function processImage(input, label) {
  await loadModels();

  const { img, buffer } = await loadImage(input);

  // Detect ALL faces with landmarks and descriptors
  const detections = await faceapi
    .detectAllFaces(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptors();

  // Rule: NO face detected → Reject
  if (detections.length === 0) {
    return {
      success: false,
      error: `${label}: No face detected in the image. Please upload a clear photo with a visible face.`,
    };
  }

  // Rule: MORE THAN ONE face → Reject
  if (detections.length > 1) {
    return {
      success: false,
      error: `${label}: Multiple faces detected (${detections.length}). Please upload an image with exactly one face.`,
    };
  }

  const detection = detections[0];

  // Run quality checks
  const qualityReport = await runQualityChecks(buffer, detection);

  if (!qualityReport.passed) {
    return {
      success: false,
      error: `${label}: Image quality check failed:\n  - ${qualityReport.issues.join('\n  - ')}`,
      qualityReport,
    };
  }

  return {
    success: true,
    descriptor: detection.descriptor, // Float32Array of 128 values
    qualityReport,
  };
}

// ──────────────────────────────────────────────
// Comparison Metrics
// ──────────────────────────────────────────────

/**
 * Euclidean distance between two 128-d descriptors
 */
function euclideanDistance(desc1, desc2) {
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    const diff = desc1[i] - desc2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/**
 * Cosine similarity between two 128-d descriptors
 */
function cosineSimilarity(desc1, desc2) {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < desc1.length; i++) {
    dotProduct += desc1[i] * desc2[i];
    norm1 += desc1[i] * desc1[i];
    norm2 += desc2[i] * desc2[i];
  }

  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

// ──────────────────────────────────────────────
// Main Verification API
// ──────────────────────────────────────────────

/**
 * Verify two face images (STRICT MODE)
 * 
 * @param {string|Buffer} ownerImage  - File path, base64 string, or Buffer
 * @param {string|Buffer} studentImage - File path, base64 string, or Buffer
 * @returns {Object} Verification result
 */
async function verifyFaces(ownerImage, studentImage) {
  console.log('\n═══════════════════════════════════════════════');
  console.log('  🔒 STRICT FACE VERIFICATION — INITIATED');
  console.log('═══════════════════════════════════════════════\n');

  const startTime = Date.now();

  // Process Owner Image
  console.log('📷 Processing Owner Image...');
  const ownerResult = await processImage(ownerImage, 'Owner Image');
  if (!ownerResult.success) {
    console.log(`❌ Owner Image rejected: ${ownerResult.error}`);
    return {
      result: 'Not Match',
      distance: null,
      similarity: null,
      confidence: 'Low',
      error: ownerResult.error,
      processingTimeMs: Date.now() - startTime,
    };
  }
  console.log('  ✅ Owner Image passed all checks');

  // Process Student Image
  console.log('📷 Processing Student Image...');
  const studentResult = await processImage(studentImage, 'Student Image');
  if (!studentResult.success) {
    console.log(`❌ Student Image rejected: ${studentResult.error}`);
    return {
      result: 'Not Match',
      distance: null,
      similarity: null,
      confidence: 'Low',
      error: studentResult.error,
      processingTimeMs: Date.now() - startTime,
    };
  }
  console.log('  ✅ Student Image passed all checks');

  // Compare embeddings
  console.log('\n🔍 Comparing face embeddings...');

  const distance = euclideanDistance(ownerResult.descriptor, studentResult.descriptor);
  const similarity = cosineSimilarity(ownerResult.descriptor, studentResult.descriptor);

  const distanceRound = Math.round(distance * 10000) / 10000;
  const similarityRound = Math.round(similarity * 10000) / 10000;

  console.log(`  📏 Euclidean Distance:  ${distanceRound} (threshold: < ${MATCH_THRESHOLDS.MAX_EUCLIDEAN_DISTANCE})`);
  console.log(`  📐 Cosine Similarity:   ${similarityRound} (threshold: > ${MATCH_THRESHOLDS.MIN_COSINE_SIMILARITY})`);

  // STRICT DECISION LOGIC — BOTH conditions must pass
  const distancePass = distance < MATCH_THRESHOLDS.MAX_EUCLIDEAN_DISTANCE;
  const similarityPass = similarity > MATCH_THRESHOLDS.MIN_COSINE_SIMILARITY;

  let result;
  let confidence;

  if (distancePass && similarityPass) {
    // Check for borderline — if either metric is very close to threshold, reject
    const distanceMargin = MATCH_THRESHOLDS.MAX_EUCLIDEAN_DISTANCE - distance;
    const similarityMargin = similarity - MATCH_THRESHOLDS.MIN_COSINE_SIMILARITY;

    if (distanceMargin < 0.03 || similarityMargin < 0.03) {
      // SECURITY: Borderline → Not Match (prioritize avoiding false positives)
      result = 'Not Match';
      confidence = 'Low';
      console.log('  ⚠️  BORDERLINE — Rejecting to avoid false positive');
    } else {
      result = 'Match';
      confidence = 'High';
      console.log('  ✅ MATCH — Both conditions satisfied with strong margins');
    }
  } else {
    result = 'Not Match';
    confidence = 'Low';
    console.log(`  ❌ NOT MATCH — Distance: ${distancePass ? 'PASS' : 'FAIL'}, Similarity: ${similarityPass ? 'PASS' : 'FAIL'}`);
  }

  const processingTime = Date.now() - startTime;

  console.log(`\n  🏁 Result: ${result} (Confidence: ${confidence})`);
  console.log(`  ⏱️  Processing time: ${processingTime}ms`);
  console.log('═══════════════════════════════════════════════\n');

  return {
    result,
    distance: distanceRound,
    similarity: similarityRound,
    confidence,
    processingTimeMs: processingTime,
    ownerQuality: ownerResult.qualityReport?.metrics,
    studentQuality: studentResult.qualityReport?.metrics,
  };
}

module.exports = {
  verifyFaces,
  loadModels,
  processImage,
  euclideanDistance,
  cosineSimilarity,
};
