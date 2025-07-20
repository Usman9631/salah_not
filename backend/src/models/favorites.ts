import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorites extends Document {
  _id: string;
  userId: string;
  masjidId: string;
  createdAt: Date;
}

const FavoritesSchema = new Schema<IFavorites>({
  userId: { type: String, required: true, ref: 'User' },
  masjidId: { type: String, required: true, ref: 'Masjid' },
  createdAt: { type: Date, default: Date.now },
});

// Compound index to prevent duplicate favorites
FavoritesSchema.index({ userId: 1, masjidId: 1 }, { unique: true });

export default mongoose.model<IFavorites>('Favorites', FavoritesSchema); 