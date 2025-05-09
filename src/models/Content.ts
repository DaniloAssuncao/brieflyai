import mongoose, { Schema, models } from 'mongoose';

const ContentSchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  tags: [String],
  source: {
    name: String,
    avatarUrl: String,
    type: { type: String, enum: ['youtube', 'article', 'newsletter'] },
    url: String,
  },
  date: { type: Date, required: true },
  readTime: String,
  favorite: { type: Boolean, default: false },
  originalUrl: String,
});

export default models.Content || mongoose.model('Content', ContentSchema); 