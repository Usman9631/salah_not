import express from 'express';
import LiveStreams from '../models/liveStreams';
import Masjid from '../models/mosque';
import Imams from '../models/imams';

const router = express.Router();

/**
 * Get all active live streams
 * GET /api/live-streams
 */
router.get('/', async (req, res) => {
  try {
    const liveStreams = await LiveStreams.find({ isActive: true })
      .populate('masjidId', 'name address logoUrl')
      .populate({
        path: 'imamId',
        populate: {
          path: 'userId',
          select: 'name'
        }
      })
      .sort({ startTime: -1 });

    const formattedStreams = liveStreams.map(stream => {
      const masjid = stream.masjidId as any;
      const imam = stream.imamId as any;
      
      return {
        id: stream._id,
        title: stream.title,
        channel: masjid?.name || 'Unknown Masjid',
        thumbnail: masjid?.logoUrl || null,
        liveUrl: stream.streamUrl,
        viewers: Math.floor(Math.random() * 1000) + 100, // Random viewer count for demo
        isLive: stream.isActive,
        description: stream.description,
        startTime: stream.startTime,
        endTime: stream.endTime,
        masjid: {
          name: masjid?.name,
          address: masjid?.address,
          logoUrl: masjid?.logoUrl
        },
        imam: {
          name: imam?.userId?.name || 'Unknown Imam'
        }
      };
    });

    res.json({
      success: true,
      liveStreams: formattedStreams
    });
  } catch (error) {
    console.error('Error fetching live streams:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Get live streams by masjid
 * GET /api/live-streams/masjid/:masjidId
 */
router.get('/masjid/:masjidId', async (req, res) => {
  try {
    const { masjidId } = req.params;
    
    const liveStreams = await LiveStreams.find({ 
      masjidId, 
      isActive: true 
    })
      .populate('imamId', 'userId')
      .populate('userId', 'name')
      .sort({ startTime: -1 });

    const formattedStreams = liveStreams.map(stream => {
      const imam = stream.imamId as any;
      
      return {
        id: stream._id,
        title: stream.title,
        liveUrl: stream.streamUrl,
        viewers: Math.floor(Math.random() * 1000) + 100,
        isLive: stream.isActive,
        description: stream.description,
        startTime: stream.startTime,
        endTime: stream.endTime,
        imam: {
          name: imam?.userId?.name || 'Unknown Imam'
        }
      };
    });

    res.json({
      success: true,
      liveStreams: formattedStreams
    });
  } catch (error) {
    console.error('Error fetching masjid live streams:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Create new live stream
 * POST /api/live-streams
 */
router.post('/', async (req, res) => {
  try {
    const {
      masjidId,
      imamId,
      title,
      description,
      streamUrl,
      startTime,
      endTime
    } = req.body;

    if (!masjidId || !imamId || !title || !streamUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Check if masjid exists
    const masjid = await Masjid.findById(masjidId);
    if (!masjid) {
      return res.status(404).json({ 
        success: false, 
        message: 'Masjid not found' 
      });
    }

    // Check if imam exists
    const imam = await Imams.findById(imamId);
    if (!imam) {
      return res.status(404).json({ 
        success: false, 
        message: 'Imam not found' 
      });
    }

    const liveStream = new LiveStreams({
      masjidId,
      imamId,
      title,
      description,
      streamUrl,
      startTime: startTime || new Date(),
      endTime,
      isActive: true
    });

    await liveStream.save();

    res.status(201).json({
      success: true,
      message: 'Live stream created successfully',
      liveStream
    });
  } catch (error) {
    console.error('Error creating live stream:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Update live stream
 * PUT /api/live-streams/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const liveStream = await LiveStreams.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!liveStream) {
      return res.status(404).json({ 
        success: false, 
        message: 'Live stream not found' 
      });
    }

    res.json({
      success: true,
      message: 'Live stream updated successfully',
      liveStream
    });
  } catch (error) {
    console.error('Error updating live stream:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Delete live stream
 * DELETE /api/live-streams/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const liveStream = await LiveStreams.findByIdAndDelete(id);

    if (!liveStream) {
      return res.status(404).json({ 
        success: false, 
        message: 'Live stream not found' 
      });
    }

    res.json({
      success: true,
      message: 'Live stream deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting live stream:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Toggle live stream status
 * PATCH /api/live-streams/:id/toggle
 */
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const liveStream = await LiveStreams.findById(id);
    if (!liveStream) {
      return res.status(404).json({ 
        success: false, 
        message: 'Live stream not found' 
      });
    }

    liveStream.isActive = !liveStream.isActive;
    await liveStream.save();

    res.json({
      success: true,
      message: `Live stream ${liveStream.isActive ? 'activated' : 'deactivated'} successfully`,
      liveStream
    });
  } catch (error) {
    console.error('Error toggling live stream:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router; 