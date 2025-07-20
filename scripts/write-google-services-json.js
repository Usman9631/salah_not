const fs = require('fs');
const path = require('path');

// Get the environment variable content
const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;

if (!googleServicesJson) {
  console.error('GOOGLE_SERVICES_JSON environment variable is not set');
  process.exit(1);
}

// Ensure the android/app directory exists
const androidAppDir = path.join(__dirname, '..', 'android', 'app');
if (!fs.existsSync(androidAppDir)) {
  fs.mkdirSync(androidAppDir, { recursive: true });
}

// Write the google-services.json file
const filePath = path.join(androidAppDir, 'google-services.json');
fs.writeFileSync(filePath, googleServicesJson);

console.log(`✅ google-services.json written to ${filePath}`); 