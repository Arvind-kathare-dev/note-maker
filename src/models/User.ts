import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string; // custom id string matching frontend Zustand state
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    role: { type: String, required: true, default: 'CLIENT' },
    avatar: { type: String },
    preferences: {
      theme: { type: String, default: 'dark' },
      sidebarLayout: { type: String, default: 'default' },
      fontFamily: { type: String, default: 'Inter' },
      accentColor: { type: String, default: 'blue' }
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
