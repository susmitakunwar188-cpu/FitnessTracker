/* global process */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data', 'db.json');

let cachedStore = null;

function getDefaultExercises(name) {
  const n = String(name || '').toLowerCase();
  if (n.includes('bicep') || n.includes('arm')) {
    return [
      { name: 'Dumbbell Bicep Curl', sets: '3', reps: '12' },
      { name: 'Hammer Curl', sets: '3', reps: '10' },
      { name: 'Concentration Curl', sets: '3', reps: '12' },
      { name: 'EZ-Bar Preacher Curl', sets: '4', reps: '8' }
    ];
  } else if (n.includes('chest') || n.includes('push')) {
    return [
      { name: 'Flat Barbell Bench Press', sets: '4', reps: '10' },
      { name: 'Incline Dumbbell Press', sets: '3', reps: '12' },
      { name: 'Cable Chest Fly', sets: '3', reps: '15' },
      { name: 'Bodyweight Push-up', sets: '3', reps: 'Max' }
    ];
  } else if (n.includes('leg') || n.includes('squat')) {
    return [
      { name: 'Barbell Back Squat', sets: '4', reps: '8' },
      { name: 'Leg Press Machine', sets: '3', reps: '12' },
      { name: 'Dumbbell Romanian Deadlift', sets: '3', reps: '10' },
      { name: 'Seated Calf Raise', sets: '4', reps: '15' }
    ];
  } else if (n.includes('core') || n.includes('abs') || n.includes('belly')) {
    return [
      { name: 'Forearm Plank Hold', sets: '3', reps: '60s' },
      { name: 'Hanging Leg Raise', sets: '3', reps: '12' },
      { name: 'Weighted Russian Twist', sets: '3', reps: '20' },
      { name: 'Ab Wheel Rollout', sets: '3', reps: '10' }
    ];
  } else if (n.includes('back') || n.includes('pull')) {
    return [
      { name: 'Barbell Conventional Deadlift', sets: '4', reps: '5' },
      { name: 'Wide-Grip Pull-up', sets: '3', reps: 'Max' },
      { name: 'Single-Arm Dumbbell Row', sets: '3', reps: '10' },
      { name: 'Lat Pulldown Machine', sets: '3', reps: '12' }
    ];
  } else if (n.includes('shoulder') || n.includes('press')) {
    return [
      { name: 'Seated Overhead Dumbbell Press', sets: '4', reps: '10' },
      { name: 'Dumbbell Lateral Raise', sets: '4', reps: '12' },
      { name: 'Bent-Over Rear Delt Fly', sets: '3', reps: '15' },
      { name: 'Cable Face Pull', sets: '3', reps: '15' }
    ];
  } else if (n.includes('cardio') || n.includes('hiit') || n.includes('run')) {
    return [
      { name: 'High-Intensity Burpees', sets: '4', reps: '45s' },
      { name: 'Mountain Climbers', sets: '4', reps: '50s' },
      { name: 'Bodyweight Air Squats', sets: '4', reps: '20' },
      { name: 'Jumping Jacks', sets: '3', reps: '60s' }
    ];
  }

  return [
    { name: 'Bodyweight Air Squat', sets: '4', reps: '15' },
    { name: 'Incline Push-up', sets: '3', reps: '12' },
    { name: 'Plank Shoulder Tap', sets: '3', reps: '20' },
    { name: 'Jumping Jack Cardio Boost', sets: '3', reps: '45s' }
  ];
}

function toUserRecord(user) {
  if (!user) return null;
  return { ...user, id: user.id || user._id || String(user._id || '') };
}

function toWorkoutRecord(workout) {
  if (!workout) return null;
  return { ...workout, id: workout.id || workout._id || String(workout._id || '') };
}

async function readStore() {
  if (cachedStore) return cachedStore;

  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    cachedStore = {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      workouts: Array.isArray(parsed.workouts) ? parsed.workouts : []
    };
    return cachedStore;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('Using empty JSON store because the data file could not be read:', error.message);
    }
    cachedStore = { users: [], workouts: [] };
    await fs.writeFile(DATA_FILE, JSON.stringify(cachedStore, null, 2), 'utf8');
    return cachedStore;
  }
}

async function writeStore(nextStore) {
  cachedStore = nextStore;
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(nextStore, null, 2), 'utf8');
}

export const db = {
  async findUserByEmail(email) {
    const state = await readStore();
    const targetEmail = String(email || '').toLowerCase();
    const user = state.users.find((entry) => String(entry.email || '').toLowerCase() === targetEmail);
    return toUserRecord(user);
  },

  async findUserById(id) {
    const state = await readStore();
    const user = state.users.find((entry) => String(entry.id) === String(id));
    return toUserRecord(user);
  },

  async createUser(user) {
    const state = await readStore();
    const usernameVal = user.username || user.email.split('@')[0];
    const newUser = {
      id: String(Date.now()),
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
    state.users.push(newUser);
    await writeStore(state);
    return toUserRecord(newUser);
  },

  async updateUserStats(userId, stats) {
    const state = await readStore();
    const index = state.users.findIndex((entry) => String(entry.id) === String(userId));
    if (index === -1) return null;

    state.users[index] = {
      ...state.users[index],
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

    await writeStore(state);
    return toUserRecord(state.users[index]);
  },

  async updateUser(userId, updates) {
    const state = await readStore();
    const index = state.users.findIndex((entry) => String(entry.id) === String(userId));
    if (index === -1) return null;

    state.users[index] = { ...state.users[index], ...updates };
    await writeStore(state);
    return toUserRecord(state.users[index]);
  },

  async getWorkouts(userId) {
    const state = await readStore();
    let list = state.workouts.filter((entry) => String(entry.userId) === String(userId));

    if (list.length === 0) {
      const defaults = [
        { id: `${Date.now()}-1`, userId, name: 'Biceps Workout', exercises: getDefaultExercises('Biceps Workout') },
        { id: `${Date.now()}-2`, userId, name: 'Chest Workout', exercises: getDefaultExercises('Chest Workout') },
        { id: `${Date.now()}-3`, userId, name: 'Legs Workout', exercises: getDefaultExercises('Legs Workout') },
        { id: `${Date.now()}-4`, userId, name: 'Core Workout', exercises: getDefaultExercises('Core Workout') }
      ];
      state.workouts.push(...defaults);
      await writeStore(state);
      list = defaults;
    }

    return list.map(toWorkoutRecord);
  },

  async createWorkout(userId, name, exercises) {
    const state = await readStore();
    const resolvedExercises = Array.isArray(exercises) ? exercises : getDefaultExercises(name);
    const workout = {
      id: `${Date.now()}`,
      userId,
      name,
      exercises: resolvedExercises
    };
    state.workouts.push(workout);
    await writeStore(state);
    return toWorkoutRecord(workout);
  },

  async updateWorkout(workoutId, userId, name, exercises) {
    const state = await readStore();
    const index = state.workouts.findIndex((entry) => String(entry.id) === String(workoutId) && String(entry.userId) === String(userId));
    if (index === -1) return null;

    state.workouts[index] = {
      ...state.workouts[index],
      name,
      exercises: Array.isArray(exercises) ? exercises : state.workouts[index].exercises
    };

    await writeStore(state);
    return toWorkoutRecord(state.workouts[index]);
  },

  async deleteWorkout(workoutId, userId) {
    const state = await readStore();
    const beforeLength = state.workouts.length;
    state.workouts = state.workouts.filter((entry) => !(String(entry.id) === String(workoutId) && String(entry.userId) === String(userId)));
    await writeStore(state);
    return state.workouts.length < beforeLength;
  }
};
