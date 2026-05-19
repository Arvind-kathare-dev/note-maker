import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string; // custom id string matching frontend Zustand state
  name: string;
  email: string;
  role: string;
  password?: string;
  assignedProjectId?: string;
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
    password: { type: String },
    assignedProjectId: { type: String },
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

// Delete cached model in dev so schema changes (like new fields) always take effect
if (process.env.NODE_ENV !== 'production' && mongoose.models.User) {
  delete (mongoose.models as any).User;
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
