import mongoose, { Document, Schema } from 'mongoose';

export interface ISalahTimings extends Document {
  _id: string;
  masjidId: string;
  date: Date;
  timings: any; // JSON object with prayer times
  iqamah: any; // JSON object with iqamah times
  jummah: any; // JSON object with jummah times
  source: string;
  createdAt: Date;
}

const SalahTimingsSchema = new Schema<ISalahTimings>({
  masjidId: { type: String, required: true, ref: 'Masjid' },
  date: { type: Date, required: true },
  timings: { type: Schema.Types.Mixed, required: true }, // JSON object
  iqamah: { type: Schema.Types.Mixed, required: true }, // JSON object
  jummah: { type: Schema.Types.Mixed, required: true }, // JSON object
  source: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Compound index for masjid and date
SalahTimingsSchema.index({ masjidId: 1, date: 1 }, { unique: true });

export default mongoose.model<ISalahTimings>('SalahTimings', SalahTimingsSchema); 