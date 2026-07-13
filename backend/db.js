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
    const userWorkouts = data.workouts.filter(w => w.userId === userId);
    // If user has no workouts, return some default workouts mapped to this user
    if (userWorkouts.length === 0) {
      const defaults = [
        { id: `${Date.now()}-1`, userId, name: "Biceps Workout", exercises: "4 Exercises" },
        { id: `${Date.now()}-2`, userId, name: "Chest Workout", exercises: "4 Exercises" },
        { id: `${Date.now()}-3`, userId, name: "Legs Workout", exercises: "4 Exercises" },
        { id: `${Date.now()}-4`, userId, name: "Core Workout", exercises: "4 Exercises" }
      ];
      data.workouts.push(...defaults);
      await writeDb(data);
      return defaults;
    }
    return userWorkouts;
  },

  async createWorkout(userId, name, exercises = "4 Exercises") {
    const data = await readDb();
    const newWorkout = {
      id: Date.now().toString(),
      userId,
      name,
      exercises
    };
    data.workouts.push(newWorkout);
    await writeDb(data);
    return newWorkout;
  },

  async updateWorkout(workoutId, userId, name) {
    const data = await readDb();
    const workoutIndex = data.workouts.findIndex(w => w.id === workoutId && w.userId === userId);
    if (workoutIndex === -1) return null;

    data.workouts[workoutIndex].name = name;
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
