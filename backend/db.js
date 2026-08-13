/* global process */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Workout from './models/Workout.js';
import WorkoutHistory from './models/History.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const DATA_FILE_PATH = path.join(__dirname, 'data', 'db.json');
const FALLBACK_DATA_TEMPLATE = { 
  users: [], 
  workouts: [], 
  history: [], 
  badges: [],
  nutrition: [],
  sleep: [],
  feed: []
};

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitique';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('MongoDB connection error:', err));

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

async function readFallbackData() {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, 'utf8');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      console.warn('Fallback JSON is malformed. Recovering with empty template.', parseErr.message);
      parsed = { ...FALLBACK_DATA_TEMPLATE };
    }
    return {
      ...FALLBACK_DATA_TEMPLATE,
      ...parsed,
      users: Array.isArray(parsed?.users) ? parsed.users : [],
      workouts: Array.isArray(parsed?.workouts) ? parsed.workouts : [],
      history: Array.isArray(parsed?.history) ? parsed.history : [],
      badges: Array.isArray(parsed?.badges) ? parsed.badges : []
    };
  } catch (err) {
    if (err?.code === 'ENOENT') {
      const seedData = { ...FALLBACK_DATA_TEMPLATE };
      await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true }).catch(() => {});
      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(seedData, null, 2)).catch(() => {});
      return seedData;
    }
    console.error('Failed to read fallback data:', err);
    return { ...FALLBACK_DATA_TEMPLATE };
  }
}

async function writeFallbackData(data) {
  try {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true }).catch(() => {});
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write fallback data:', err);
  }
}

function normalizeFallbackUser(user) {
  if (!user) return null;
  const normalized = { ...user };
  if (!normalized.id && normalized._id) {
    normalized.id = normalized._id.toString();
  }
  return normalized;
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

function mapDoc(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ virtuals: true });
  obj.id = obj._id.toString();
  return obj;
}

// DB Operations
export const db = {
  // Users
  async findUserByEmail(email) {
    if (isMongoConnected()) {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        return mapDoc(user);
      } catch (err) {
        console.warn('Mongo user lookup failed, falling back to JSON store:', err.message);
      }
    }

    const data = await readFallbackData();
    const normalizedEmail = String(email || '').toLowerCase();
    const fallbackUser = data.users.find((entry) => String(entry.email || '').toLowerCase() === normalizedEmail);
    return fallbackUser ? normalizeFallbackUser(fallbackUser) : null;
  },

  async findUserById(id) {
    if (isMongoConnected()) {
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        const user = await User.findById(id);
        return mapDoc(user);
      } catch (err) {
        console.warn('Mongo user lookup by id failed, falling back to JSON store:', err.message);
      }
    }

    const data = await readFallbackData();
    const fallbackUser = data.users.find((entry) => entry.id === id);
    return fallbackUser ? normalizeFallbackUser(fallbackUser) : null;
  },

  async createUser(user) {
    if (isMongoConnected()) {
      try {
        const usernameVal = user.username || user.email.split('@')[0];
        const newUser = new User({
          email: user.email,
          password: user.password,
          username: usernameVal,
          avatarUrl: user.avatarUrl || '',
          bio: user.bio || '',
          age: user.age || '',
          weight: user.weight || '',
          height: user.height || '',
          bmi: user.bmi || null,
          status: user.status || '',
          goal: user.goal || '',
          resetToken: user.resetToken || null,
          resetTokenExpiry: user.resetTokenExpiry || null
        });
        await newUser.save();
        return mapDoc(newUser);
      } catch (err) {
        console.warn('Mongo user creation failed, falling back to JSON store:', err.message);
      }
    }

    const data = await readFallbackData();
    const usernameVal = user.username || user.email.split('@')[0];
    const newUser = {
      id: `${Date.now()}`,
      email: user.email,
      password: user.password,
      username: usernameVal,
      avatarUrl: user.avatarUrl || '',
      bio: user.bio || '',
      age: user.age || '',
      weight: user.weight || '',
      height: user.height || '',
      bmi: user.bmi || null,
      status: user.status || '',
      goal: user.goal || '',
      resetToken: user.resetToken || null,
      resetTokenExpiry: user.resetTokenExpiry || null
    };
    data.users.push(newUser);
    await writeFallbackData(data);
    return normalizeFallbackUser(newUser);
  },

  async updateUserStats(userId, stats) {
    if (isMongoConnected()) {
      try {
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
      } catch (err) {
        console.warn('Mongo profile update failed, falling back to JSON store:', err.message);
      }
    }

    const data = await readFallbackData();
    const index = data.users.findIndex((entry) => entry.id === userId);
    if (index === -1) return null;
    data.users[index] = {
      ...data.users[index],
      age: stats.age,
      weight: stats.weight,
      height: stats.height,
      bmi: stats.bmi,
      status: stats.status,
      goal: stats.goal,
      username: stats.username,
      avatarUrl: stats.avatarUrl,
      bio: stats.bio
    };
    await writeFallbackData(data);
    return normalizeFallbackUser(data.users[index]);
  },

  async updateUser(userId, updates) {
    if (isMongoConnected()) {
      try {
        if (!mongoose.Types.ObjectId.isValid(userId)) return null;
        const updated = await User.findByIdAndUpdate(userId, {
          $set: updates
        }, { new: true });
        return mapDoc(updated);
      } catch (err) {
        console.warn('Mongo user update failed, falling back to JSON store:', err.message);
      }
    }

    const data = await readFallbackData();
    const index = data.users.findIndex((entry) => entry.id === userId);
    if (index === -1) return null;
    data.users[index] = {
      ...data.users[index],
      ...updates
    };
    await writeFallbackData(data);
    return normalizeFallbackUser(data.users[index]);
  },

  // Workouts
  async getWorkouts(userId) {
    if (isMongoConnected()) {
      try {
        const list = await Workout.find({ userId });
        if (list.length === 0) {
          const defaults = [
            { userId, name: 'Biceps Workout', exercises: getDefaultExercises('Biceps Workout') },
            { userId, name: 'Chest Workout', exercises: getDefaultExercises('Chest Workout') },
            { userId, name: 'Legs Workout', exercises: getDefaultExercises('Legs Workout') },
            { userId, name: 'Core Workout', exercises: getDefaultExercises('Core Workout') }
          ];
          const inserted = await Workout.insertMany(defaults);
          return inserted.map(mapDoc);
        }
        return list.map(mapDoc);
      } catch (err) {
        console.warn('Mongo workouts lookup failed, falling back to JSON store:', err.message);
      }
    }

    const data = await readFallbackData();
    let workouts = data.workouts.filter((entry) => entry.userId === userId);
    if (workouts.length === 0) {
      workouts = [
        { id: `${userId}-1`, userId, name: 'Biceps Workout', exercises: getDefaultExercises('Biceps Workout') },
        { id: `${userId}-2`, userId, name: 'Chest Workout', exercises: getDefaultExercises('Chest Workout') },
        { id: `${userId}-3`, userId, name: 'Legs Workout', exercises: getDefaultExercises('Legs Workout') },
        { id: `${userId}-4`, userId, name: 'Core Workout', exercises: getDefaultExercises('Core Workout') }
      ];
      data.workouts.push(...workouts);
      await writeFallbackData(data);
    }
    return workouts;
  },

  async createWorkout(userId, name, exercises, imageUrl) {
    if (isMongoConnected()) {
      try {
        const resolvedExercises = Array.isArray(exercises) ? exercises : getDefaultExercises(name);
        const workout = new Workout({
          userId,
          name,
          imageUrl: imageUrl || '',
          exercises: resolvedExercises
        });
        await workout.save();
        return mapDoc(workout);
      } catch (err) {
        console.warn('Mongo workout creation failed, falling back to JSON store:', err.message);
      }
    }

    const data = await readFallbackData();
    const resolvedExercises = Array.isArray(exercises) ? exercises : getDefaultExercises(name);
    const workout = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      name,
      imageUrl: imageUrl || '',
      exercises: resolvedExercises
    };
    data.workouts.push(workout);
    await writeFallbackData(data);
    return workout;
  },

  async updateWorkout(workoutId, userId, name, exercises, imageUrl) {
    if (isMongoConnected()) {
      try {
        if (!mongoose.Types.ObjectId.isValid(workoutId)) return null;
        const updateData = { name };
        if (Array.isArray(exercises)) {
          updateData.exercises = exercises;
        }
        if (typeof imageUrl === 'string') {
          updateData.imageUrl = imageUrl;
        }
        const updated = await Workout.findOneAndUpdate(
          { _id: workoutId, userId },
          { $set: updateData },
          { new: true }
        );
        return mapDoc(updated);
      } catch (err) {
        console.warn('Mongo workout update failed, falling back to JSON store:', err.message);
      }
    }

    const data = await readFallbackData();
    const index = data.workouts.findIndex((entry) => entry.id === workoutId && entry.userId === userId);
    if (index === -1) return null;
    data.workouts[index] = {
      ...data.workouts[index],
      name,
      exercises: Array.isArray(exercises) ? exercises : data.workouts[index].exercises,
      ...(typeof imageUrl === 'string' ? { imageUrl } : {})
    };
    await writeFallbackData(data);
    return data.workouts[index];
  },

  async deleteWorkout(workoutId, userId) {
    if (isMongoConnected()) {
      try {
        if (!mongoose.Types.ObjectId.isValid(workoutId)) return false;
        const res = await Workout.deleteOne({ _id: workoutId, userId });
        return res.deletedCount > 0;
      } catch (err) {
        console.warn('Mongo workout delete failed, falling back to JSON store:', err.message);
      }
    }

    const data = await readFallbackData();
    const beforeLength = data.workouts.length;
    data.workouts = data.workouts.filter((entry) => !(entry.id === workoutId && entry.userId === userId));
    await writeFallbackData(data);
    return data.workouts.length < beforeLength;
  },

  // Workout History
  async logWorkoutHistory(userId, workoutName, duration, completedExercises) {
    if (isMongoConnected()) {
      try {
        const history = new WorkoutHistory({
          userId,
          workoutName,
          duration,
          completedExercises: Array.isArray(completedExercises) ? completedExercises : []
        });
        await history.save();
        return mapDoc(history);
      } catch (err) {
        console.warn('Mongo history logging failed, falling back to JSON store:', err.message);
      }
    }

    const data = await readFallbackData();
    const history = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      workoutName,
      duration,
      completedExercises: Array.isArray(completedExercises) ? completedExercises : [],
      completedAt: new Date().toISOString()
    };
    data.history.push(history);
    await writeFallbackData(data);
    return history;
  },

  async getWorkoutHistory(userId) {
    if (isMongoConnected()) {
      try {
        const list = await WorkoutHistory.find({ userId }).sort({ completedAt: -1 });
        return list.map(mapDoc);
      } catch (err) {
        console.warn('Mongo workout history lookup failed, falling back to JSON store:', err.message);
      }
    }

    const data = await readFallbackData();
    return data.history.filter((entry) => entry.userId === userId).sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0));
  },

  async clearWorkoutHistory(userId) {
    if (isMongoConnected()) {
      try {
        const res = await WorkoutHistory.deleteMany({ userId });
        return res.deletedCount > 0;
      } catch (err) {
        console.warn('Mongo history clear failed, falling back to JSON store:', err.message);
      }
    }

    const data = await readFallbackData();
    const beforeLength = data.history.length;
    data.history = data.history.filter((entry) => entry.userId !== userId);
    await writeFallbackData(data);
    return data.history.length < beforeLength;
  }
};

export const getUseFallback = () => !isMongoConnected();

export { readFallbackData, writeFallbackData };
