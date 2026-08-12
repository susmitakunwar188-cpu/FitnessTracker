import express from 'express';
import Nutrition from '../models/Nutrition.js';
import Sleep from '../models/Sleep.js';
import Feed from '../models/Feed.js';
import { getUseFallback, readFallbackData, writeFallbackData } from '../db.js';

const router = express.Router();

// Get Nutrition for a user
router.get('/nutrition/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query; // YYYY-MM-DD
    
    if (getUseFallback()) {
      const data = await readFallbackData();
      const userNutrition = data.nutrition.find(n => n.userId === userId && n.date === date);
      return res.json(userNutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, meals: [] });
    }

    let userNutrition = await Nutrition.findOne({ userId, date });
    if (!userNutrition) {
      userNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, meals: [] };
    }
    res.json(userNutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching nutrition' });
  }
});

// Update Nutrition
router.post('/nutrition', async (req, res) => {
  try {
    const { userId, date, calories, protein, carbs, fat, meals } = req.body;
    
    if (getUseFallback()) {
      const data = await readFallbackData();
      const existingIdx = data.nutrition.findIndex(n => n.userId === userId && n.date === date);
      if (existingIdx !== -1) {
        data.nutrition[existingIdx] = { ...data.nutrition[existingIdx], calories, protein, carbs, fat, meals };
      } else {
        data.nutrition.push({ userId, date, calories, protein, carbs, fat, meals });
      }
      await writeFallbackData(data);
      return res.json({ success: true });
    }

    await Nutrition.findOneAndUpdate(
      { userId, date },
      { calories, protein, carbs, fat, meals },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating nutrition' });
  }
});

// Get Sleep data
router.get('/sleep/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    
    if (getUseFallback()) {
      const data = await readFallbackData();
      const userSleep = data.sleep.find(s => s.userId === userId && s.date === date);
      return res.json(userSleep || { durationHours: 0, quality: 'Good', recoveryScore: 0 });
    }

    let userSleep = await Sleep.findOne({ userId, date });
    if (!userSleep) {
      userSleep = { durationHours: 0, quality: 'Good', recoveryScore: 0 };
    }
    res.json(userSleep);
  } catch {
    res.status(500).json({ error: 'Server error fetching sleep' });
  }
});

// Update Sleep
router.post('/sleep', async (req, res) => {
  try {
    const { userId, date, durationHours, quality } = req.body;
    
    // Calculate recovery score based on duration and quality
    let baseScore = Math.min((durationHours / 8) * 100, 100);
    if (quality === 'Poor') baseScore *= 0.6;
    if (quality === 'Fair') baseScore *= 0.8;
    if (quality === 'Excellent') baseScore = Math.min(baseScore * 1.1, 100);
    const recoveryScore = Math.round(baseScore);

    if (getUseFallback()) {
      const data = await readFallbackData();
      const existingIdx = data.sleep.findIndex(s => s.userId === userId && s.date === date);
      if (existingIdx !== -1) {
        data.sleep[existingIdx] = { ...data.sleep[existingIdx], durationHours, quality, recoveryScore };
      } else {
        data.sleep.push({ userId, date, durationHours, quality, recoveryScore });
      }
      await writeFallbackData(data);
      return res.json({ recoveryScore });
    }

    await Sleep.findOneAndUpdate(
      { userId, date },
      { durationHours, quality, recoveryScore },
      { upsert: true }
    );
    res.json({ recoveryScore });
  } catch {
    res.status(500).json({ error: 'Server error updating sleep' });
  }
});

// Get Feed
router.get('/feed', async (req, res) => {
  try {
    if (getUseFallback()) {
      const data = await readFallbackData();
      return res.json(data.feed.slice(-20).reverse());
    }

    const feed = await Feed.find().sort({ createdAt: -1 }).limit(20);
    res.json(feed);
  } catch {
    res.status(500).json({ error: 'Server error fetching feed' });
  }
});

// Post to Feed
router.post('/feed', async (req, res) => {
  try {
    const { userId, userName, action } = req.body;
    
    if (getUseFallback()) {
      const data = await readFallbackData();
      const newPost = { userId, userName, action, likes: 0, createdAt: new Date().toISOString() };
      data.feed.push(newPost);
      await writeFallbackData(data);
      return res.json(newPost);
    }

    const newPost = await Feed.create({ userId, userName, action });
    res.json(newPost);
  } catch {
    res.status(500).json({ error: 'Server error posting to feed' });
  }
});

// Like a post
router.post('/feed/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (getUseFallback()) {
      // Simple mock for fallback (no real persistence for likes)
      return res.json({ success: true });
    }

    await Feed.findByIdAndUpdate(id, { $inc: { likes: 1 } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error liking post' });
  }
});

export default router;
