import mongoose, { Document, Schema } from 'mongoose';

export interface IReminders extends Document {
  _id: string;
  userId: string;
  masjidId: string;
  reminderType: string;
  salahName: string;
  enabled: boolean;
  vibrate: boolean;
  customTime: string;
  testSound: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RemindersSchema = new Schema<IReminders>({
  userId: { type: String, required: true, ref: 'User' },
  masjidId: { type: String, required: true, ref: 'Masjid' },
  reminderType: { type: String, required: true },
  salahName: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  vibrate: { type: Boolean, default: true },
  customTime: { type: String },
  testSound: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReminders>('Reminders', RemindersSchema); 