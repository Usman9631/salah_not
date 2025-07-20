const http = require('http');

const BACKEND_URL = 'http://192.168.100.145:4000';
let testCount = 0;

async function sendTestNotification() {
  testCount++;
  console.log(`\n🧪 Test #${testCount} - Sending notification...`);
  
  try {
    const data = JSON.stringify({
      title: `Test #${testCount}`,
      body: `This is automatic test notification #${testCount}`
    });

    const options = {
      hostname: '192.168.100.145',
      port: 4000,
      path: '/api/notifications/send-notification',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          console.log(`📱 Response:`, response);
          
          if (response.success) {
            console.log(`✅ Notification sent successfully! Success count: ${response.successCount}`);
          } else {
            console.log(`❌ Failed to send notification: ${response.message}`);
          }
        } catch (error) {
          console.log(`❌ Error parsing response:`, error.message);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error sending notification:`, error.message);
    });

    req.write(data);
    req.end();
  } catch (error) {
    console.log(`❌ Error sending notification:`, error.message);
  }
}

// Send first notification immediately
sendTestNotification();

// Send notification every 30 seconds
setInterval(sendTestNotification, 30000);

console.log('🤖 Automatic notification testing started!');
console.log('📱 Sending test notification every 30 seconds...');
console.log('🛑 Press Ctrl+C to stop\n'); 