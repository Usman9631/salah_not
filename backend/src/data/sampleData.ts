import mongoose from 'mongoose';
import User from '../models/user';
import Masjid from '../models/mosque';
import Imams from '../models/imams';
import SalahTimings from '../models/salahTimings';
import Announcements from '../models/announcements';
import LiveStreams from '../models/liveStreams';

const MONGODB_URI = 'mongodb://localhost:27017/as-salah-db';

async function createSampleData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create sample users
    const users = await User.create([
      {
        name: 'Ahmed Khan',
        email: 'ahmed@example.com',
        passwordHash: '$2a$10$example.hash',
        phone: '+92 300 1234567',
        address: 'Karachi, Pakistan',
        role: 'user',
        favourites: []
      },
      {
        name: 'Fatima Ali',
        email: 'fatima@example.com',
        passwordHash: '$2a$10$example.hash',
        phone: '+92 300 7654321',
        address: 'Lahore, Pakistan',
        role: 'user',
        favourites: []
      }
    ]);

    // Create sample masjids
    const masjids = await Masjid.create([
      {
        name: 'Masjid Al-Falah',
        address: '123 Main Street, Karachi',
        city: 'Karachi',
        country: 'Pakistan',
        location: {
          type: 'Point',
          coordinates: [67.0011, 24.8607]
        },
        contact: '+92 300 1234567',
        email: 'info@masjidalfalah.com',
        website: 'https://masjidalfalah.com',
        logoUrl: 'https://via.placeholder.com/150x150?text=Masjid+Al-Falah',
        description: 'A central masjid serving the local community',
        capacity: 500,
        facilities: ['Parking', 'Library', 'Islamic Classes'],
        prayerSettings: {
          fajrIqamah: 5,
          dhuhrIqamah: 5,
          asrIqamah: 5,
          maghribIqamah: 5,
          ishaIqamah: 5,
          jummahIqamah: 5
        },
        managers: [users[0]._id],
        isActive: true
      },
      {
        name: 'Masjid Noor',
        address: '456 Park Avenue, Lahore',
        city: 'Lahore',
        country: 'Pakistan',
        location: {
          type: 'Point',
          coordinates: [74.3587, 31.5204]
        },
        contact: '+92 300 7654321',
        email: 'info@masjidnoor.com',
        website: 'https://masjidnoor.com',
        logoUrl: 'https://via.placeholder.com/150x150?text=Masjid+Noor',
        description: 'A beautiful masjid in the heart of Lahore',
        capacity: 300,
        facilities: ['Parking', 'Islamic Classes'],
        prayerSettings: {
          fajrIqamah: 5,
          dhuhrIqamah: 5,
          asrIqamah: 5,
          maghribIqamah: 5,
          ishaIqamah: 5,
          jummahIqamah: 5
        },
        managers: [users[1]._id],
        isActive: true
      }
    ]);

    // Create sample imams
    const imams = await Imams.create([
      {
        userId: users[0]._id,
        masjidId: masjids[0]._id,
        specialization: 'Quran Recitation',
        experience: 10,
        education: 'Islamic University',
        isActive: true
      },
      {
        userId: users[1]._id,
        masjidId: masjids[1]._id,
        specialization: 'Islamic Studies',
        experience: 8,
        education: 'Al-Azhar University',
        isActive: true
      }
    ]);

    // Create sample prayer timings
    await SalahTimings.create([
      {
        masjidId: masjids[0]._id,
        date: new Date(),
        fajr: '04:30',
        sunrise: '06:00',
        dhuhr: '12:15',
        asr: '15:30',
        maghrib: '18:45',
        isha: '20:15',
        jummah: '13:30'
      },
      {
        masjidId: masjids[1]._id,
        date: new Date(),
        fajr: '04:25',
        sunrise: '05:55',
        dhuhr: '12:10',
        asr: '15:25',
        maghrib: '18:40',
        isha: '20:10',
        jummah: '13:25'
      }
    ]);

    // Create sample announcements
    await Announcements.create([
      {
        masjidId: masjids[0]._id,
        title: 'Jumuah Prayer Announcement',
        content: 'Jumuah prayer will be held at 1:30 PM today.',
        type: 'prayer',
        priority: 'high',
        isActive: true
      },
      {
        masjidId: masjids[1]._id,
        title: 'Islamic Classes',
        content: 'Islamic classes for children will start from next week.',
        type: 'event',
        priority: 'medium',
        isActive: true
      }
    ]);

    // Create sample live streams
    await LiveStreams.create([
      {
        masjidId: masjids[0]._id,
        imamId: imams[0]._id,
        title: 'Live Jumuah Khutbah - Masjid Al-Falah',
        description: 'Weekly Jumuah prayer and khutbah',
        streamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        startTime: new Date(),
        isActive: true
      },
      {
        masjidId: masjids[1]._id,
        imamId: imams[1]._id,
        title: 'Live Taraweeh Prayer - Masjid Noor',
        description: 'Taraweeh prayer during Ramadan',
        streamUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        startTime: new Date(),
        isActive: true
      }
    ]);

    console.log('Sample data created successfully');
    console.log('Users:', users.length);
    console.log('Masjids:', masjids.length);
    console.log('Imams:', imams.length);
    console.log('Live Streams created');

  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createSampleData(); 