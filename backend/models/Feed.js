import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const feedSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  action: { type: String, required: true }, // e.g. "Completed Leg Day Burner"
  type: {
    type: String,
    enum: ['workout', 'run', 'nutrition', 'goal', 'social'],
    default: 'workout'
  },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Feed || mongoose.model('Feed', feedSchema);
