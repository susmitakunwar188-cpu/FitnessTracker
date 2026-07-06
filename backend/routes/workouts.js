import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware.js';

const router = express.Router();

// Apply auth middleware to all workouts endpoints
router.use(authenticateToken);

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
  const { name, exercises } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Workout name is required' });
  }
  try {
    const newWorkout = await db.createWorkout(req.userId, name, exercises || '4 Exercises');
    res.status(201).json(newWorkout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating workout' });
  }
});

// Update workout name
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Workout name is required' });
  }
  try {
    const updated = await db.updateWorkout(req.params.id, req.userId, name);
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
