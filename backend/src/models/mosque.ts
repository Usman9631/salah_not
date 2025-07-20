import mongoose, { Document, Schema } from 'mongoose';

export interface IMasjid extends Document {
  _id: string;
  name: string;
  address: string;
  postalCode: string;
  country: string;
  state: string;
  city: string;
  email: string;
  passwordHash: string;
  logoUrl?: string;
  salahTimingsFile: string;
  status: string;
  location: { latitude: number; longitude: number };
  createdAt: Date;
  primaryLanguage: string;
  secondaryLanguage: string;
  managers: any[]; // JSON array of manager details
  iqamaTimes: any; // JSON object
  jummahSettings: any; // JSON object
  settings: any; // JSON object
  approvedby?: string;
}

const MasjidSchema = new Schema<IMasjid>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    logoUrl: { type: String },
    salahTimingsFile: { type: String, required: true },
    status: { type: String, default: 'pending' },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    createdAt: { type: Date, default: Date.now },
    primaryLanguage: { type: String, required: true },
    secondaryLanguage: { type: String, required: true },
    managers: { type: Schema.Types.Mixed, default: [] }, // JSON array
    iqamaTimes: { type: Schema.Types.Mixed, default: {} }, // JSON object
    jummahSettings: { type: Schema.Types.Mixed, default: {} }, // JSON object
    settings: { type: Schema.Types.Mixed, default: {} }, // JSON object
    approvedby: { type: String }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMasjid>('Masjid', MasjidSchema);
