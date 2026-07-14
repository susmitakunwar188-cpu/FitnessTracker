import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data', 'db.json');

// Ensure database file and directories exist
async function initDb() {
  try {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    try {
      await fs.access(dbPath);
    } catch {
      // Create empty db.json if not exists
      await fs.writeFile(dbPath, JSON.stringify({ users: [], workouts: [] }, null, 2));
    }
  } catch (err) {
    console.error("Failed to initialize database:", err);
  }
}

// Read whole database
async function readDb() {
  await initDb();
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch {
    return { users: [], workouts: [] };
  }
}

// Write to database
async function writeDb(data) {
  await initDb();
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
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
    const data = await readDb();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  async findUserById(id) {
    const data = await readDb();
    return data.users.find(u => u.id === id);
  },

  async createUser(user) {
    const data = await readDb();
    const newUser = {
      id: Date.now().toString(),
      email: user.email,
      password: user.password, // already hashed
      age: "",
      weight: "",
      height: "",
      bmi: null,
      status: "",
      goal: "",
      username: user.username || user.email.split("@")[0],
      avatarUrl: user.avatarUrl || "",
      bio: user.bio || "",
      ...user
    };
    data.users.push(newUser);
    await writeDb(data);
    return newUser;
  },

  async updateUserStats(userId, stats) {
    const data = await readDb();
    const userIndex = data.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    data.users[userIndex] = {
      ...data.users[userIndex],
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
    await writeDb(data);
    return data.users[userIndex];
  },

  async updateUser(userId, updates) {
    const data = await readDb();
    const userIndex = data.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    data.users[userIndex] = {
      ...data.users[userIndex],
      ...updates
    };
    await writeDb(data);
    return data.users[userIndex];
  },

  // Workouts
  async getWorkouts(userId) {
    const data = await readDb();
    let userWorkouts = data.workouts.filter(w => w.userId === userId);
    // If user has no workouts, return some default workouts mapped to this user
    if (userWorkouts.length === 0) {
      const defaults = [
        { id: `${Date.now()}-1`, userId, name: "Biceps Workout", exercises: getDefaultExercises("Biceps Workout") },
        { id: `${Date.now()}-2`, userId, name: "Chest Workout", exercises: getDefaultExercises("Chest Workout") },
        { id: `${Date.now()}-3`, userId, name: "Legs Workout", exercises: getDefaultExercises("Legs Workout") },
        { id: `${Date.now()}-4`, userId, name: "Core Workout", exercises: getDefaultExercises("Core Workout") }
      ];
      data.workouts.push(...defaults);
      await writeDb(data);
      return defaults;
    }

    // Migrate string exercises to array exercises in database if any exist
    let migrated = false;
    data.workouts.forEach(w => {
      if (w.userId === userId && typeof w.exercises === 'string') {
        w.exercises = getDefaultExercises(w.name);
        migrated = true;
      }
    });

    if (migrated) {
      await writeDb(data);
      userWorkouts = data.workouts.filter(w => w.userId === userId);
    }

    return userWorkouts;
  },

  async createWorkout(userId, name, exercises) {
    const data = await readDb();
    const resolvedExercises = Array.isArray(exercises) ? exercises : getDefaultExercises(name);
    const newWorkout = {
      id: Date.now().toString(),
      userId,
      name,
      exercises: resolvedExercises
    };
    data.workouts.push(newWorkout);
    await writeDb(data);
    return newWorkout;
  },

  async updateWorkout(workoutId, userId, name, exercises) {
    const data = await readDb();
    const workoutIndex = data.workouts.findIndex(w => w.id === workoutId && w.userId === userId);
    if (workoutIndex === -1) return null;

    data.workouts[workoutIndex].name = name;
    if (Array.isArray(exercises)) {
      data.workouts[workoutIndex].exercises = exercises;
    }
    await writeDb(data);
    return data.workouts[workoutIndex];
  },

  async deleteWorkout(workoutId, userId) {
    const data = await readDb();
    const filtered = data.workouts.filter(w => !(w.id === workoutId && w.userId === userId));
    const wasDeleted = data.workouts.length !== filtered.length;
    data.workouts = filtered;
    await writeDb(data);
    return wasDeleted;
  }
};
