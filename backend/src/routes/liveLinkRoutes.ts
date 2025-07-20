import { Router } from 'express';
import LiveLink from '../models/livestreaming';

const router = Router();

// POST /api/set-live-link
router.post('/set-live-link', async (req, res) => {
  try {
    const { url, isLive } = req.body;
    if (!url) return res.status(400).json({ message: 'URL is required' });

    const link = await LiveLink.findOneAndUpdate(
      {},
      { url, isLive: !!isLive, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true, link });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/get-live-link
router.get('/get-live-link', async (_req, res) => {
  try {
    const link = await LiveLink.findOne();
    if (!link) return res.json({ url: null, isLive: false });

    res.json({ url: link.url, isLive: link.isLive });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
