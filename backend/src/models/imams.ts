import mongoose, { Document, Schema } from 'mongoose';

export interface IImams extends Document {
  _id: string;
  userId: string;
  masjidId: string;
  role: string;
  permissions: any; // JSON object
  createdAt: Date;
}

const ImamsSchema = new Schema<IImams>({
  userId: { type: String, required: true, ref: 'User' },
  masjidId: { type: String, required: true, ref: 'Masjid' },
  role: { type: String, required: true },
  permissions: { type: Schema.Types.Mixed, default: {} }, // JSON object
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IImams>('Imams', ImamsSchema); 