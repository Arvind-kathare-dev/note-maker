import mongoose, { Schema, Document } from 'mongoose';

export interface IFolder extends Document {
  id: string;
  name: string;
  parentId: string | null;
  projectId: string | null;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FolderSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    parentId: { type: String, default: null },
    projectId: { type: String, default: null, index: true },
    icon: { type: String, default: '📁' },
    color: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Folder || mongoose.model<IFolder>('Folder', FolderSchema);
