// routes/favouriteMasjidRoutes.ts

import express from 'express';
import User from '../models/user';
import Masjid from '../models/mosque';
import Favorites from '../models/favorites';

const router = express.Router();

/**
 * Test endpoint to check user authentication
 * GET /api/user/test-auth/:userId
 */
router.get('/test-auth/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ 
        success: false, 
        message: "User not found",
        userId 
      });
    }
    
    res.json({ 
      success: true, 
      message: "User found",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Error testing user auth:', err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * Get user's favourite masjids
 * GET /api/user/:userId/favourite-masjids
 */
router.get('/:userId/favourite-masjids', async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

  try {
    // Check if user exists first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Get user's favorites
    const favorites = await Favorites.find({ userId }).populate('masjidId');
    
    // Format the response
    const favouriteMasajids = favorites.map(fav => {
      const masjid = fav.masjidId as any;
      return {
        _id: masjid._id,
        name: masjid.name,
        address: masjid.address,
        logoUrl: masjid.logoUrl,
        location: masjid.location,
      };
    });

    res.json({ 
      success: true, 
      favouriteMasajids 
    });
  } catch (err) {
    console.error('Error fetching favourite masjids:', err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * Add a masjid to user's favourites
 * POST /api/user/favourite-masjid
 * Body: { userId, masjidId }
 */
router.post('/favourite-masjid', async (req, res) => {
  const { userId, masjidId } = req.body;
  if (!userId || !masjidId) return res.status(400).json({ success: false, message: "Missing userId or masjidId" });

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if masjid exists
    const masjid = await Masjid.findById(masjidId);
    if (!masjid) {
      return res.status(404).json({ success: false, message: "Masjid not found" });
    }

    // Check if already favorited
    const existingFavorite = await Favorites.findOne({ userId, masjidId });
    if (existingFavorite) {
      return res.status(400).json({ success: false, message: "Masjid already in favorites" });
    }

    // Add to favorites
    const favorite = new Favorites({
      userId,
      masjidId,
    });

    await favorite.save();
    
    res.json({ 
      success: true, 
      message: "Masjid added to favourites"
    });
  } catch (err) {
    console.error('Error adding favourite masjid:', err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * Remove a masjid from user's favourites
 * DELETE /api/user/favourite-masjid
 * Body: { userId, masjidId }
 */
router.delete('/favourite-masjid', async (req, res) => {
  const { userId, masjidId } = req.body;
  if (!userId || !masjidId) return res.status(400).json({ success: false, message: "Missing userId or masjidId" });

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const result = await Favorites.findOneAndDelete({ userId, masjidId });
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Favorite not found" });
    }
    
    res.json({ 
      success: true, 
      message: "Masjid removed from favourites"
    });
  } catch (err) {
    console.error('Error removing favourite masjid:', err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
