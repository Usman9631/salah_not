import express from 'express';
import Settings from '../models/settings';
import User from '../models/user';

const router = express.Router();

/**
 * Get available adhan sounds
 * GET /api/settings/adhan-sounds
 */
router.get('/adhan-sounds', async (req, res) => {
  try {
    const adhanSounds = [
      { id: 'adhan1.mp3', name: 'Traditional Adhan', duration: '2:30' },
      { id: 'adhan2.mp3', name: 'Modern Adhan', duration: '2:15' },
      { id: 'adhan3.mp3', name: 'Classical Adhan', duration: '2:45' },
      { id: 'adhan4.mp3', name: 'Harmonic Adhan', duration: '2:20' },
      { id: 'adhan5.mp3', name: 'Melodic Adhan', duration: '2:35' },
    ];

    res.json({
      success: true,
      adhanSounds
    });
  } catch (error) {
    console.error('Error fetching adhan sounds:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Get available iqamah sounds
 * GET /api/settings/iqamah-sounds
 */
router.get('/iqamah-sounds', async (req, res) => {
  try {
    const iqamahSounds = [
      { id: 'iqamah1.mp3', name: 'Traditional Iqamah', duration: '1:15' },
      { id: 'iqamah2.mp3', name: 'Modern Iqamah', duration: '1:10' },
      { id: 'iqamah3.mp3', name: 'Classical Iqamah', duration: '1:20' },
      { id: 'iqamah4.mp3', name: 'Harmonic Iqamah', duration: '1:12' },
      { id: 'iqamah5.mp3', name: 'Melodic Iqamah', duration: '1:18' },
    ];

    res.json({
      success: true,
      iqamahSounds
    });
  } catch (error) {
    console.error('Error fetching iqamah sounds:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Get audio modes
 * GET /api/settings/audio-modes
 */
router.get('/audio-modes', async (req, res) => {
  try {
    const audioModes = [
      { id: 'normal', name: 'Normal Mode', description: 'Standard audio playback' },
      { id: 'vibrate', name: 'Vibrate Only', description: 'Vibrate without sound' },
      { id: 'silent', name: 'Silent Mode', description: 'No sound or vibration' },
      { id: 'headphones', name: 'Headphones Mode', description: 'Optimized for headphones' },
      { id: 'speaker', name: 'Speaker Mode', description: 'Optimized for speaker' },
    ];

    res.json({
      success: true,
      audioModes
    });
  } catch (error) {
    console.error('Error fetching audio modes:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Get user settings
 * GET /api/settings/:userId
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get or create settings
    let settings = await Settings.findOne({ userId });
    
    if (!settings) {
      // Create default settings
      settings = new Settings({
        userId,
        adhanSound: 'adhan1.mp3',
        iqamahSound: 'iqamah1.mp3',
        vibrateOnReminder: true,
        silentModeEnabled: false,
        silentBeforeMinutes: 0,
        silentDuration: 0,
        fajrAlarmTime: '05:00',
        audioMode: 'normal',
        overlayAllowed: true,
        autoStart: false,
        batteryOptDisabled: false,
      });
      await settings.save();
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Update user settings
 * PUT /api/settings/:userId
 */
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      adhanSound,
      iqamahSound,
      vibrateOnReminder,
      silentModeEnabled,
      silentBeforeMinutes,
      silentDuration,
      fajrAlarmTime,
      audioMode,
      overlayAllowed,
      autoStart,
      batteryOptDisabled
    } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update or create settings
    const settings = await Settings.findOneAndUpdate(
      { userId },
      {
        adhanSound,
        iqamahSound,
        vibrateOnReminder,
        silentModeEnabled,
        silentBeforeMinutes,
        silentDuration,
        fajrAlarmTime,
        audioMode,
        overlayAllowed,
        autoStart,
        batteryOptDisabled
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Update specific setting
 * PATCH /api/settings/:userId/:setting
 */
router.patch('/:userId/:setting', async (req, res) => {
  try {
    const { userId, setting } = req.params;
    const { value } = req.body;

    if (!userId || !setting) {
      return res.status(400).json({ success: false, message: 'User ID and setting are required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Validate setting field
    const validSettings = [
      'adhanSound', 'iqamahSound', 'vibrateOnReminder', 'silentModeEnabled',
      'silentBeforeMinutes', 'silentDuration', 'fajrAlarmTime', 'audioMode',
      'overlayAllowed', 'autoStart', 'batteryOptDisabled'
    ];

    if (!validSettings.includes(setting)) {
      return res.status(400).json({ success: false, message: 'Invalid setting field' });
    }

    // Update specific setting
    const updateData = { [setting]: value };
    const settings = await Settings.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: `${setting} updated successfully`,
      settings
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * Reset settings to default
 * POST /api/settings/:userId/reset
 */
router.post('/:userId/reset', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Reset to default settings
    const defaultSettings = {
      adhanSound: 'adhan1.mp3',
      iqamahSound: 'iqamah1.mp3',
      vibrateOnReminder: true,
      silentModeEnabled: false,
      silentBeforeMinutes: 0,
      silentDuration: 0,
      fajrAlarmTime: '05:00',
      audioMode: 'normal',
      overlayAllowed: true,
      autoStart: false,
      batteryOptDisabled: false,
    };

    const settings = await Settings.findOneAndUpdate(
      { userId },
      defaultSettings,
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Settings reset to default successfully',
      settings
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router; 