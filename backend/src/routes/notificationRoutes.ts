import { Router } from 'express';
import * as admin from 'firebase-admin';
import Token from '../models/token';

console.log('Loaded notificationRoutes');

const router = Router();

// GET /send-notification/test - Test endpoint without Firebase
router.get('/send-notification/test', async (req, res) => {
  try {
    const tokensDocs = await Token.find({});
    const tokens = tokensDocs.map(doc => doc.token);
    res.json({ 
      success: true, 
      message: 'Test endpoint working', 
      tokenCount: tokens.length,
      tokens: tokens 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as any).message });
  }
});

// POST /send-notification/mock - Mock notification without Firebase
router.post('/send-notification/mock', async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ success: false, message: 'Title and body are required' });
  }
  try {
    const tokensDocs = await Token.find({});
    const tokens = tokensDocs.map(doc => doc.token);
    if (!tokens.length) {
      return res.status(200).json({ success: false, message: 'No tokens found' });
    }
    
    // Mock successful notification sending
    res.json({ 
      success: true, 
      message: 'Mock notification sent successfully',
      notification: { title, body },
      tokenCount: tokens.length,
      tokens: tokens
    });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as any).message });
  }
});

// POST /send-notification - Using Firebase Admin SDK
router.post('/send-notification', async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ success: false, message: 'Title and body are required' });
  }
  try {
    const tokensDocs = await Token.find({});
    const tokens = tokensDocs.map(doc => doc.token);
    if (!tokens.length) {
      return res.status(200).json({ success: false, message: 'No tokens found' });
    }
    
    try {
      // Use Firebase Admin SDK to send notifications
      const message = {
        notification: { title, body },
        tokens,
      };
      const response = await admin.messaging().sendMulticast(message);
      res.json({ 
        success: true, 
        message: 'Notifications sent via Firebase',
        notification: { title, body },
        tokenCount: tokens.length,
        successCount: response.successCount,
        failureCount: response.failureCount
      });
    } catch (firebaseError: any) {
      console.error('Firebase error:', firebaseError);
      // Fallback to Expo push service
      const messages = tokens.map(token => ({
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: { someData: 'goes here' },
      }));

      let successCount = 0;
      for (const message of messages) {
        try {
          const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          });
          
          if (response.ok) {
            successCount++;
          }
        } catch (error) {
          console.error('Error sending via Expo:', error);
        }
      }
      
      res.json({ 
        success: true, 
        message: 'Notifications sent via Expo (Firebase fallback)',
        notification: { title, body },
        tokenCount: tokens.length,
        successCount: successCount,
        firebaseError: firebaseError.message
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: (err as any).message });
  }
});

export default router; 