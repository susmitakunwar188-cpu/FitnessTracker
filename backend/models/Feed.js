import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String, required: true },
  action: { type: String, required: true }, // e.g. "Completed Leg Day Burner"
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Feed || mongoose.model('Feed', feedSchema);
