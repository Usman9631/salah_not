import mongoose from 'mongoose';

const liveLinkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  isLive: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

// Model ka naam 'LiveLink' hi rehne do
export default mongoose.model('LiveLink', liveLinkSchema, 'livelinks');
