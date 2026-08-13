import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: String, default: "" },
  reps: { type: String, default: "" }
});

const workoutSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  exercises: [exerciseSchema]
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;
