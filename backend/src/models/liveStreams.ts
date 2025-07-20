import mongoose, { Document, Schema } from 'mongoose';

export interface ILiveStreams extends Document {
  _id: string;
  masjidId: string;
  imamId: string;
  title: string;
  description?: string;
  streamUrl: string;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  createdAt: Date;
}

const LiveStreamsSchema = new Schema<ILiveStreams>({
  masjidId: { type: String, required: true, ref: 'Masjid' },
  imamId: { type: String, required: true, ref: 'Imams' },
  title: { type: String, required: true },
  description: { type: String },
  streamUrl: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ILiveStreams>('LiveStreams', LiveStreamsSchema); 