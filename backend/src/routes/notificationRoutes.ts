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

// POST /send-notification/simple - Simple notification without Firebase
router.post('/send-notification/simple', async (req, res) => {
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
    
    // Just return success without actually sending via Firebase
    res.json({ 
      success: true, 
      message: 'Notification would be sent to devices',
      title,
      body,
      tokenCount: tokens.length,
      tokens: tokens
    });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as any).message });
  }
});

// POST /send-notification
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
    const message = {
      notification: { title, body },
      tokens,
    };
    const response = await admin.messaging().sendMulticast(message);
    res.json({ success: true, response, successCount: response.successCount });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as any).message });
  }
});

export default router; 