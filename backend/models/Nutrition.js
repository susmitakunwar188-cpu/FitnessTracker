import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  meals: [{
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  }]
});

export default mongoose.models.Nutrition || mongoose.model('Nutrition', nutritionSchema);
