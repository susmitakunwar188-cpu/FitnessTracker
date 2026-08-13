import express from 'express';
import { db } from '../db.js';
import { authenticateToken, validateCsrf } from '../middleware/auth.js';

const router = express.Router();

// Apply auth + CSRF protection to all workouts endpoints
router.use(authenticateToken, validateCsrf);

// Get all workouts for current user
router.get('/', async (req, res) => {
  try {
    const workouts = await db.getWorkouts(req.userId);
    res.json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching workouts' });
  }
});

// Create new workout
router.post('/', async (req, res) => {
  const { name, exercises, imageUrl } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Workout name is required' });
  }
  try {
    const newWorkout = await db.createWorkout(req.userId, name, exercises, imageUrl);
    res.status(201).json(newWorkout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating workout' });
  }
});

// Get completed workout history
router.get('/history', async (req, res) => {
  try {
    const history = await db.getWorkoutHistory(req.userId);
    res.json(history);
  } catch (err) {
    console.error("Get History Error:", err);
    res.status(500).json({ error: 'Server error retrieving workout history' });
  }
});

// Log a completed workout
router.post('/history', async (req, res) => {
  const { workoutName, duration, completedExercises } = req.body;
  if (!workoutName || duration === undefined) {
    return res.status(400).json({ error: 'Workout name and duration are required' });
  }
  try {
    const record = await db.logWorkoutHistory(req.userId, workoutName, duration, completedExercises);
    res.status(201).json(record);
  } catch (err) {
    console.error("Log History Error:", err);
    res.status(500).json({ error: 'Server error logging completed workout' });
  }
});

// Clear workout history
router.delete('/history/all', async (req, res) => {
  try {
    await db.clearWorkoutHistory(req.userId);
    res.json({ message: 'Workout history cleared successfully' });
  } catch (err) {
    console.error("Clear History Error:", err);
    res.status(500).json({ error: 'Server error clearing history' });
  }
});

// Update workout name
router.put('/:id', async (req, res) => {
  const { name, exercises, imageUrl } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Workout name is required' });
  }
  try {
    const updated = await db.updateWorkout(req.params.id, req.userId, name, exercises, imageUrl);
    if (!updated) {
      return res.status(404).json({ error: 'Workout not found or unauthorized' });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating workout' });
  }
});

// Delete workout
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.deleteWorkout(req.params.id, req.userId);
    if (!deleted) {
      return res.status(404).json({ error: 'Workout not found or unauthorized' });
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting workout' });
  }
});

export default router;
