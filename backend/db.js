/* global process */
import mongoose from 'mongoose';
import User from './models/User.js';
import Workout from './models/Workout.js';
import WorkoutHistory from './models/History.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitique';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('MongoDB connection error:', err));

function mapDoc(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ virtuals: true });
  obj.id = obj._id.toString();
  return obj;
}

function getDefaultExercises(name) {
  const n = name.toLowerCase();
  if (n.includes("bicep") || n.includes("arm")) {
    return [
      { name: "Dumbbell Bicep Curl", sets: "3", reps: "12" },
      { name: "Hammer Curl", sets: "3", reps: "10" },
      { name: "Concentration Curl", sets: "3", reps: "12" },
      { name: "EZ-Bar Preacher Curl", sets: "4", reps: "8" }
    ];
  } else if (n.includes("chest") || n.includes("push")) {
    return [
      { name: "Flat Barbell Bench Press", sets: "4", reps: "10" },
      { name: "Incline Dumbbell Press", sets: "3", reps: "12" },
      { name: "Cable Chest Fly", sets: "3", reps: "15" },
      { name: "Bodyweight Push-up", sets: "3", reps: "Max" }
    ];
  } else if (n.includes("leg") || n.includes("squat")) {
    return [
      { name: "Barbell Back Squat", sets: "4", reps: "8" },
      { name: "Leg Press Machine", sets: "3", reps: "12" },
      { name: "Dumbbell Romanian Deadlift", sets: "3", reps: "10" },
      { name: "Seated Calf Raise", sets: "4", reps: "15" }
    ];
  } else if (n.includes("core") || n.includes("abs") || n.includes("belly")) {
    return [
      { name: "Forearm Plank Hold", sets: "3", reps: "60s" },
      { name: "Hanging Leg Raise", sets: "3", reps: "12" },
      { name: "Weighted Russian Twist", sets: "3", reps: "20" },
      { name: "Ab Wheel Rollout", sets: "3", reps: "10" }
    ];
  } else if (n.includes("back") || n.includes("pull")) {
    return [
      { name: "Barbell Conventional Deadlift", sets: "4", reps: "5" },
      { name: "Wide-Grip Pull-up", sets: "3", reps: "Max" },
      { name: "Single-Arm Dumbbell Row", sets: "3", reps: "10" },
      { name: "Lat Pulldown Machine", sets: "3", reps: "12" }
    ];
  } else if (n.includes("shoulder") || n.includes("press")) {
    return [
      { name: "Seated Overhead Dumbbell Press", sets: "4", reps: "10" },
      { name: "Dumbbell Lateral Raise", sets: "4", reps: "12" },
      { name: "Bent-Over Rear Delt Fly", sets: "3", reps: "15" },
      { name: "Cable Face Pull", sets: "3", reps: "15" }
    ];
  } else if (n.includes("cardio") || n.includes("hiit") || n.includes("run")) {
    return [
      { name: "High-Intensity Burpees", sets: "4", reps: "45s" },
      { name: "Mountain Climbers", sets: "4", reps: "50s" },
      { name: "Bodyweight Air Squats", sets: "4", reps: "20" },
      { name: "Jumping Jacks", sets: "3", reps: "60s" }
    ];
  } else {
    return [
      { name: "Bodyweight Air Squat", sets: "4", reps: "15" },
      { name: "Incline Push-up", sets: "3", reps: "12" },
      { name: "Plank Shoulder Tap", sets: "3", reps: "20" },
      { name: "Jumping Jack Cardio Boost", sets: "3", reps: "45s" }
    ];
  }
}

// DB Operations
export const db = {
  // Users
  async findUserByEmail(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    return mapDoc(user);
  },

  async findUserById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const user = await User.findById(id);
    return mapDoc(user);
  },

  async createUser(user) {
    const usernameVal = user.username || user.email.split("@")[0];
    const newUser = new User({
      email: user.email,
      password: user.password,
      username: usernameVal,
      avatarUrl: user.avatarUrl || "",
      bio: user.bio || "",
      age: user.age || "",
      weight: user.weight || "",
      height: user.height || "",
      bmi: user.bmi || null,
      status: user.status || "",
      goal: user.goal || "",
      resetToken: user.resetToken || null,
      resetTokenExpiry: user.resetTokenExpiry || null
    });
    await newUser.save();
    return mapDoc(newUser);
  },

  async updateUserStats(userId, stats) {
    if (!mongoose.Types.ObjectId.isValid(userId)) return null;
    const updated = await User.findByIdAndUpdate(userId, {
      $set: {
        age: stats.age,
        weight: stats.weight,
        height: stats.height,
        bmi: stats.bmi,
        status: stats.status,
        goal: stats.goal,
        username: stats.username,
        avatarUrl: stats.avatarUrl,
        bio: stats.bio
      }
    }, { new: true });
    return mapDoc(updated);
  },

  async updateUser(userId, updates) {
    if (!mongoose.Types.ObjectId.isValid(userId)) return null;
    const updated = await User.findByIdAndUpdate(userId, {
      $set: updates
    }, { new: true });
    return mapDoc(updated);
  },

  // Workouts
  async getWorkouts(userId) {
    const list = await Workout.find({ userId });
    if (list.length === 0) {
      const defaults = [
        { userId, name: "Biceps Workout", exercises: getDefaultExercises("Biceps Workout") },
        { userId, name: "Chest Workout", exercises: getDefaultExercises("Chest Workout") },
        { userId, name: "Legs Workout", exercises: getDefaultExercises("Legs Workout") },
        { userId, name: "Core Workout", exercises: getDefaultExercises("Core Workout") }
      ];
      const inserted = await Workout.insertMany(defaults);
      return inserted.map(mapDoc);
    }
    return list.map(mapDoc);
  },

  async createWorkout(userId, name, exercises) {
    const resolvedExercises = Array.isArray(exercises) ? exercises : getDefaultExercises(name);
    const workout = new Workout({
      userId,
      name,
      exercises: resolvedExercises
    });
    await workout.save();
    return mapDoc(workout);
  },

  async updateWorkout(workoutId, userId, name, exercises) {
    if (!mongoose.Types.ObjectId.isValid(workoutId)) return null;
    const updateData = { name };
    if (Array.isArray(exercises)) {
      updateData.exercises = exercises;
    }
    const updated = await Workout.findOneAndUpdate(
      { _id: workoutId, userId },
      { $set: updateData },
      { new: true }
    );
    return mapDoc(updated);
  },

  async deleteWorkout(workoutId, userId) {
    if (!mongoose.Types.ObjectId.isValid(workoutId)) return false;
    const res = await Workout.deleteOne({ _id: workoutId, userId });
    return res.deletedCount > 0;
  },

  // Workout History
  async logWorkoutHistory(userId, workoutName, duration, completedExercises) {
    const history = new WorkoutHistory({
      userId,
      workoutName,
      duration,
      completedExercises: Array.isArray(completedExercises) ? completedExercises : []
    });
    await history.save();
    return mapDoc(history);
  },

  async getWorkoutHistory(userId) {
    const list = await WorkoutHistory.find({ userId }).sort({ completedAt: -1 });
    return list.map(mapDoc);
  },

  async clearWorkoutHistory(userId) {
    const res = await WorkoutHistory.deleteMany({ userId });
    return res.deletedCount > 0;
  }
};
