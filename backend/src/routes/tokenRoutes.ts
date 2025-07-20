import { Router } from 'express';
import Token from '../models/token';

const router = Router();

// POST /api/register-token
router.post('/register-token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: 'Token is required' });

  try {
    const exists = await Token.findOne({ token });
    if (!exists) await Token.create({ token });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/tokens - List all registered tokens
router.get('/tokens', async (req, res) => {
  try {
    const tokens = await Token.find({});
    res.json({ success: true, count: tokens.length, tokens: tokens.map(t => t.token) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
