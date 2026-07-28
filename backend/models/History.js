import mongoose from 'mongoose';

const workoutHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  workoutName: { type: String, required: true },
  duration: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
  completedExercises: { type: [String], default: [] }
}, { timestamps: true });

const WorkoutHistory = mongoose.model('WorkoutHistory', workoutHistorySchema);
export default WorkoutHistory;
