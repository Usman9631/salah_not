import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  _id: string;
  userId: string;
  adhanSound: string;
  iqamahSound: string;
  vibrateOnReminder: boolean;
  silentModeEnabled: boolean;
  silentBeforeMinutes: number;
  silentDuration: number;
  fajrAlarmTime: string;
  audioMode: string;
  overlayAllowed: boolean;
  autoStart: boolean;
  batteryOptDisabled: boolean;
}

const SettingsSchema = new Schema<ISettings>({
  userId: { type: String, required: true, ref: 'User' },
  adhanSound: { type: String, required: true },
  iqamahSound: { type: String, required: true },
  vibrateOnReminder: { type: Boolean, default: true },
  silentModeEnabled: { type: Boolean, default: false },
  silentBeforeMinutes: { type: Number, default: 0 },
  silentDuration: { type: Number, default: 0 },
  fajrAlarmTime: { type: String, required: true },
  audioMode: { type: String, default: 'normal' },
  overlayAllowed: { type: Boolean, default: true },
  autoStart: { type: Boolean, default: false },
  batteryOptDisabled: { type: Boolean, default: false },
});

export default mongoose.model<ISettings>('Settings', SettingsSchema); 