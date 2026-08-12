import mongoose from 'mongoose';

const sleepSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  durationHours: { type: Number, required: true },
  quality: { type: String, enum: ['Poor', 'Fair', 'Good', 'Excellent'], default: 'Good' },
  recoveryScore: { type: Number, default: 0 } // 0-100
});

export default mongoose.models.Sleep || mongoose.model('Sleep', sleepSchema);
