const fs = require('fs');
const path = require('path');

const googleServices = process.env.GOOGLE_SERVICES_JSON;
if (!googleServices) {
  throw new Error('GOOGLE_SERVICES_JSON env variable is not set');
}

const targetPath = path.join(__dirname, '../android/app/google-services.json');
fs.writeFileSync(targetPath, googleServices);
console.log('google-services.json written to android/app/'); 