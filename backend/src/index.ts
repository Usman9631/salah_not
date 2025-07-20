import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import * as admin from 'firebase-admin';
import serviceAccount from '../credentials/serviceAccountKey.json';

admin.initializeApp({ credential: admin.credential.cert(serviceAccount as admin.ServiceAccount) });

// Import routes
import authRoutes from './routes/authRoutes';
import masjidRoutes from './routes/MasjidRoutes';
import favouriteMasjidRoutes from './routes/favouriteMasjidRoutes';
import editUserProfileRoutes from './routes/editUserProfileRoutes';
import liveLinkRoutes from './routes/liveLinkRoutes';
import tokenRoutes from './routes/tokenRoutes';
import userRoleRoutes from './routes/userRoleRoutes';
import settingsRoutes from './routes/settingsRoutes';
import liveStreamRoutes from './routes/liveStreamRoutes';
import notificationRoutes from './routes/notificationRoutes';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/as-salah-db')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Create sample data on first run
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/masjid', masjidRoutes);
app.use('/api/user', favouriteMasjidRoutes);
app.use('/api/user', editUserProfileRoutes);
app.use('/api', liveLinkRoutes);
app.use('/api', tokenRoutes);
app.use('/api/user', userRoleRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/live-streams', liveStreamRoutes);
app.use('/api', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AS-Salah API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

