import express from 'express';
import multer from 'multer';
import path from 'path';
import Masjid from '../models/mosque';
import SalahTimings from '../models/salahTimings';
import Announcements from '../models/announcements';
import Imams from '../models/imams';

const router = express.Router();

// 📦 Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/logos');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// ✅ Create Masjid
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const {
      name,
      address,
      postalCode,
      country,
      state,
      city,
      email,
      passwordHash,
      primaryLanguage,
      secondaryLanguage,
      latitude,
      longitude,
    } = req.body;

    const masjid = new Masjid({
      name,
      address,
      postalCode,
      country,
      state,
      city,
      email,
      passwordHash,
      logoUrl: req.file ? `/uploads/logos/${req.file.filename}` : null,
      salahTimingsFile: 'default.json',
      status: 'pending',
      location: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
      primaryLanguage,
      secondaryLanguage,
      managers: [],
      iqamaTimes: {},
      jummahSettings: {},
      settings: {},
    });

    await masjid.save();
    res.status(201).json({ success: true, masjid });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ GET all masjids grouped by Country → City → Masajid[]
router.get('/grouped', async (_req, res) => {
  try {
    const masajid = await Masjid.find({ status: 'approved' });

    const grouped = masajid.reduce((acc: any, masjid) => {
      const { country, city } = masjid;

      if (!acc[country]) {
        acc[country] = {};
      }

      if (!acc[country][city]) {
        acc[country][city] = [];
      }

      acc[country][city].push({
        _id: masjid._id,
        name: masjid.name,
        address: masjid.address,
        logoUrl: masjid.logoUrl,
        location: masjid.location,
      });

      return acc;
    }, {});

    const result = Object.entries(grouped).map(([countryName, citiesObj]: any) => ({
      name: countryName,
      cities: Object.entries(citiesObj).map(([cityName, masajid]: any) => ({
        name: cityName,
        masajid,
      })),
    }));

    res.json({
      success: true,
      countries: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ GET masjid details with prayer timings and announcements
router.get('/:id/namaz-timings', async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const masjid = await Masjid.findById(id);
    if (!masjid) {
      return res.status(404).json({ success: false, message: 'Masjid not found' });
    }

    // Get today's prayer timings
    const salahTimings = await SalahTimings.findOne({
      masjidId: id,
      date: today
    });

    // Get active announcements
    const announcements = await Announcements.find({
      masjidId: id,
      visibleOn: { $lte: new Date() },
      expiresOn: { $gte: new Date() }
    });

    // Get imam details for announcements
    const imamIds = [...new Set(announcements.map(ann => ann.imamId))];
    const imams = await Imams.find({ _id: { $in: imamIds } }).populate('userId', 'name');
    const imamMap = new Map(imams.map(imam => [imam._id.toString(), (imam.userId as any)?.name || 'Unknown']));

    res.status(200).json({
      success: true,
      namazTiming: salahTimings?.timings || {},
      iqamah: salahTimings?.iqamah || {},
      jummah: salahTimings?.jummah || {},
      announcements: announcements.map(ann => ({
        _id: ann._id,
        message: ann.message,
        imam: imamMap.get(ann.imamId.toString()) || 'Unknown',
        audience: ann.audience,
        createdAt: ann.createdAt
      })),
      masjid: {
        name: masjid.name,
        address: masjid.address,
        logoUrl: masjid.logoUrl,
        location: masjid.location,
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ GET masjid by ID
router.get('/:id', async (req, res) => {
  try {
    const masjid = await Masjid.findById(req.params.id);
    if (!masjid) {
      return res.status(404).json({ success: false, message: 'Masjid not found' });
    }
    res.json({ success: true, data: masjid });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Add new announcement to a specific masjid
router.post('/:id/create-announcements', async (req, res) => {
  try {
    const { id } = req.params;
    const { message, imamId, audience, visibleOn, expiresOn } = req.body;

    if (!message || !imamId || !audience) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const masjid = await Masjid.findById(id);
    if (!masjid) {
      return res.status(404).json({ success: false, message: 'Masjid not found' });
    }

    const announcement = new Announcements({
      masjidId: id,
      message,
      imamId,
      audience,
      visibleOn: visibleOn || new Date(),
      expiresOn: expiresOn || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
    });

    await announcement.save();

    res.status(201).json({
      success: true,
      message: 'Announcement added successfully',
      announcement
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
