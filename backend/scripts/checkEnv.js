const requiredVars = ['MONGO_URI', 'JWT_SECRET'];
const missing = requiredVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.warn(`[WARNING] Missing environment variables: ${missing.join(', ')}. Using development fallbacks.`);
} else {
  console.log('Environment validation passed.');
}
