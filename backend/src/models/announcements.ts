import mongoose, { Document, Schema } from 'mongoose';

export interface IAnnouncements extends Document {
  _id: string;
  masjidId: string;
  message?: string;
  imamId: string;
  audience: string;
  visibleOn: Date;
  expiresOn: Date;
  createdAt: Date;
}

const AnnouncementsSchema = new Schema<IAnnouncements>({
  masjidId: { type: String, required: true, ref: 'Masjid' },
  message: { type: String },
  imamId: { type: String, required: true, ref: 'Imams' },
  audience: { type: String, required: true },
  visibleOn: { type: Date, required: true },
  expiresOn: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAnnouncements>('Announcements', AnnouncementsSchema); 