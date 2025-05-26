import mongoose, { Document, Schema, models } from 'mongoose';

export interface IContent extends Document {
  title: string;
  summary: string;
  tags?: string[];
  source?: {
    name?: string;
    avatarUrl?: string;
    type?: 'youtube' | 'article' | 'newsletter' | 'other';
    url?: string;
  };
  date: Date;
  readTime?: string;
  favorite?: boolean;
  originalUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ContentSchema = new Schema<IContent>({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  tags: [String],
  source: {
    name: String,
    avatarUrl: String,
    type: { type: String, enum: ['youtube', 'article', 'newsletter', 'other'] },
    url: String,
  },
  date: { type: Date, required: true },
  readTime: String,
  favorite: { type: Boolean, default: false },
  originalUrl: String,
}, { timestamps: true });

const Content = models.Content as mongoose.Model<IContent> || mongoose.model<IContent>('Content', ContentSchema);

export default Content;