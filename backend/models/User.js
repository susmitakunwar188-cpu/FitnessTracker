import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  age: { type: String, default: "" },
  weight: { type: String, default: "" },
  height: { type: String, default: "" },
  bmi: { type: Number, default: null },
  status: { type: String, default: "" },
  goal: { type: String, default: "" },
  username: { type: String, default: "" },
  avatarUrl: { type: String, default: "" },
  bio: { type: String, default: "" },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
