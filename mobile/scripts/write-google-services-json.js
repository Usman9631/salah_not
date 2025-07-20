const fs = require('fs');
const path = require('path');

// Get the google-services.json content from environment variable
const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;

if (!googleServicesJson) {
  console.error('GOOGLE_SERVICES_JSON environment variable is not set');
  process.exit(1);
}

try {
  // Write the content to android/app/google-services.json
  const filePath = path.join(__dirname, '..', 'android', 'app', 'google-services.json');
  const dirPath = path.dirname(filePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  fs.writeFileSync(filePath, googleServicesJson);
  console.log('✅ google-services.json written successfully');
} catch (error) {
  console.error('❌ Error writing google-services.json:', error);
  process.exit(1);
} 