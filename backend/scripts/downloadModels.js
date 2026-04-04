/**
 * Download face-api.js model weights
 * 
 * Models needed:
 * - ssd_mobilenetv1 (face detection)
 * - face_landmark_68 (landmark detection for quality checks)
 * - face_recognition (128-d embedding extraction)
 * 
 * Run: node scripts/downloadModels.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, '..', 'models', 'face-api');
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

const MODEL_FILES = [
  // SSD MobileNet V1 - Face Detection
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'ssd_mobilenetv1_model-shard2',
  // Face Landmark 68 - Landmark Detection
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  // Face Recognition - 128-d Embedding
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`Failed to download ${url}: HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  // Create models directory
  if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
  }

  console.log(`📂 Downloading face-api.js models to: ${MODELS_DIR}\n`);

  let downloaded = 0;
  let skipped = 0;

  for (const file of MODEL_FILES) {
    const dest = path.join(MODELS_DIR, file);
    
    if (fs.existsSync(dest)) {
      const stats = fs.statSync(dest);
      if (stats.size > 0) {
        console.log(`  ✅ ${file} (already exists, ${(stats.size / 1024).toFixed(1)} KB)`);
        skipped++;
        continue;
      }
    }

    const url = `${BASE_URL}/${file}`;
    process.stdout.write(`  ⬇️  Downloading ${file}...`);
    
    try {
      await downloadFile(url, dest);
      const stats = fs.statSync(dest);
      console.log(` Done (${(stats.size / 1024).toFixed(1)} KB)`);
      downloaded++;
    } catch (err) {
      console.log(` FAILED: ${err.message}`);
    }
  }

  console.log(`\n✅ Complete: ${downloaded} downloaded, ${skipped} skipped`);
}

main().catch(console.error);
