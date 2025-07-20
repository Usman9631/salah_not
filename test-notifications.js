const fetch = require('node-fetch');

const BACKEND_URL = 'http://192.168.100.145:4000';
let testCount = 0;

async function sendTestNotification() {
  testCount++;
  console.log(`\n🧪 Test #${testCount} - Sending notification...`);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/notifications/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Test #${testCount}`,
        body: `This is automatic test notification #${testCount}`
      }),
    });
    
    const data = await response.json();
    console.log(`📱 Response:`, data);
    
    if (data.success) {
      console.log(`✅ Notification sent successfully! Success count: ${data.successCount}`);
    } else {
      console.log(`❌ Failed to send notification: ${data.message}`);
    }
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