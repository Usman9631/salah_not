const fs = require('fs');
const path = require('path');

console.log('🔧 Starting google-services.json prebuild script...');

// Get the environment variable content
const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;

if (!googleServicesJson) {
  console.error('❌ GOOGLE_SERVICES_JSON environment variable is not set');
  console.log('Available environment variables:', Object.keys(process.env).filter(key => key.includes('GOOGLE')));
  process.exit(1);
}

console.log('✅ GOOGLE_SERVICES_JSON environment variable found');

try {
  // Ensure the android/app directory exists
  const androidAppDir = path.join(__dirname, '..', 'android', 'app');
  console.log('📁 Creating directory:', androidAppDir);
  
  if (!fs.existsSync(androidAppDir)) {
    fs.mkdirSync(androidAppDir, { recursive: true });
    console.log('✅ Created android/app directory');
  } else {
    console.log('✅ android/app directory already exists');
  }

  // Write the google-services.json file
  const filePath = path.join(androidAppDir, 'google-services.json');
  console.log('📝 Writing google-services.json to:', filePath);
  
  fs.writeFileSync(filePath, googleServicesJson);
  console.log('✅ google-services.json written successfully');
  
  // Verify the file was written
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ File verification: ${filePath} exists (${stats.size} bytes)`);
  } else {
    console.error('❌ File verification failed: file does not exist after writing');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Error in prebuild script:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}

console.log('🎉 Prebuild script completed successfully'); 