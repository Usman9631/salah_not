import mongoose, { Document, Schema } from 'mongoose';

export interface IDonations extends Document {
  _id: string;
  userId: string;
  masjidId: string;
  reason: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  paymentIntentId: string;
  createdAt: Date;
}

const DonationsSchema = new Schema<IDonations>({
  userId: { type: String, required: true, ref: 'User' },
  masjidId: { type: String, required: true, ref: 'Masjid' },
  reason: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'PKR' },
  method: { type: String, required: true },
  status: { type: String, default: 'pending' },
  paymentIntentId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDonations>('Donations', DonationsSchema); 