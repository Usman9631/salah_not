import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  address: string;
  favourites: string[]; // Array of masjid IDs
  createdAt: Date;
  verified: boolean;
  otpCode?: string;
  otpExpiry?: Date;
  role: string;
  paymentMethods: any[]; // JSON array of payment methods
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: false, default: 'Not provided' },
  address: { type: String, required: false, default: 'Not provided' },
  favourites: { type: [String], default: [] }, // Array of masjid IDs
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  otpCode: { type: String },
  otpExpiry: { type: Date },
  role: { type: String, default: 'user' },
  paymentMethods: { type: Schema.Types.Mixed, default: [] }, // JSON array
});

export default mongoose.model<IUser>("User", UserSchema);
