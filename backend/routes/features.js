import express from 'express';
import Nutrition from '../models/Nutrition.js';
import Sleep from '../models/Sleep.js';
import Feed from '../models/Feed.js';
import { getUseFallback, readFallbackData, writeFallbackData } from '../db.js';
import { authenticateToken, validateCsrf } from '../middleware/auth.js';

const router = express.Router();

// Require an authenticated session and CSRF token for all feature routes.
// GET/HEAD/OPTIONS pass through validateCsrf untouched.
router.use(authenticateToken, validateCsrf);

const getQualityFromHours = (hours) => {
  if (hours < 6) return 'Poor';
  if (hours < 7) return 'Fair';
  if (hours <= 9) return 'Good';
  return 'Excellent';
};

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

// Get Sleep week (last 7 days)
router.get('/sleep/:userId/week', async (req, res) => {
  try {
    const { userId } = req.params;
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      days.push(d.toISOString().split('T')[0]);
    }

    if (getUseFallback()) {
      const data = await readFallbackData();
      const entries = data.sleep.filter(s => s.userId === userId && days.includes(s.date));
      return res.json(entries);
    }

    const entries = await Sleep.find({ userId, date: { $in: days } });
    res.json(entries);
  } catch {
    res.status(500).json({ error: 'Server error fetching sleep week' });
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
      return res.json(userSleep || { durationHours: 0, quality: 'Good', recoveryScore: 0, bedtime: '', wakeTime: '' });
    }

    let userSleep = await Sleep.findOne({ userId, date });
    if (!userSleep) {
      userSleep = { durationHours: 0, quality: 'Good', recoveryScore: 0, bedtime: '', wakeTime: '' };
    }
    res.json(userSleep);
  } catch {
    res.status(500).json({ error: 'Server error fetching sleep' });
  }
});

// Update Sleep
router.post('/sleep', async (req, res) => {
  try {
    const { userId, date, durationHours, quality, bedtime = '', wakeTime = '' } = req.body;
    const effectiveQuality = quality || getQualityFromHours(durationHours);

    // Calculate recovery score based on duration and quality
    let baseScore = Math.min((durationHours / 8) * 100, 100);
    if (effectiveQuality === 'Poor') baseScore *= 0.6;
    if (effectiveQuality === 'Fair') baseScore *= 0.8;
    if (effectiveQuality === 'Excellent') baseScore = Math.min(baseScore * 1.1, 100);
    const recoveryScore = Math.round(baseScore);

    if (getUseFallback()) {
      const data = await readFallbackData();
      const existingIdx = data.sleep.findIndex(s => s.userId === userId && s.date === date);
      if (existingIdx !== -1) {
        data.sleep[existingIdx] = { ...data.sleep[existingIdx], durationHours, quality: effectiveQuality, recoveryScore, bedtime, wakeTime };
      } else {
        data.sleep.push({ userId, date, durationHours, quality: effectiveQuality, recoveryScore, bedtime, wakeTime });
      }
      await writeFallbackData(data);
      return res.json({ recoveryScore });
    }

    await Sleep.findOneAndUpdate(
      { userId, date },
      { durationHours, quality: effectiveQuality, recoveryScore, bedtime, wakeTime },
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
      return res.json(data.feed.slice(-50).reverse());
    }

    const feed = await Feed.find().sort({ createdAt: -1 }).limit(50);
    res.json(feed);
  } catch {
    res.status(500).json({ error: 'Server error fetching feed' });
  }
});

// Post to Feed
router.post('/feed', async (req, res) => {
  try {
    const { userId, userName, action = '', avatarUrl = '', imageUrl = '', type = 'social' } = req.body;

    if (getUseFallback()) {
      const data = await readFallbackData();
      const newPost = {
        _id: `feed-${Date.now()}`,
        userId,
        userName,
        avatarUrl,
        action,
        imageUrl,
        type,
        likes: 0,
        likedBy: [],
        comments: [],
        createdAt: new Date().toISOString()
      };
      data.feed.push(newPost);
      await writeFallbackData(data);
      return res.json(newPost);
    }

    const newPost = await Feed.create({ userId, userName, avatarUrl, action, imageUrl, type });
    res.json(newPost);
  } catch {
    res.status(500).json({ error: 'Server error posting to feed' });
  }
});

const findFeedPost = (data, id) => data.feed.find(p => p._id === id || p.id === id);

// Like / Unlike a post
router.post('/feed/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body || {};

    if (getUseFallback()) {
      const data = await readFallbackData();
      const post = findFeedPost(data, id);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      if (!Array.isArray(post.likedBy)) post.likedBy = [];
      const idx = post.likedBy.indexOf(userId);
      let liked;
      if (idx !== -1) {
        post.likedBy.splice(idx, 1);
        liked = false;
      } else {
        post.likedBy.push(userId);
        liked = true;
      }
      post.likes = post.likedBy.length;
      await writeFallbackData(data);
      return res.json({ liked, likes: post.likes });
    }

    const post = await Feed.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    let liked;
    if (post.likedBy.includes(userId)) {
      post.likedBy.pull(userId);
      liked = false;
    } else {
      post.likedBy.push(userId);
      liked = true;
    }
    post.likes = post.likedBy.length;
    await post.save();
    res.json({ liked, likes: post.likes });
  } catch {
    res.status(500).json({ error: 'Server error liking post' });
  }
});

// Comment on a post
router.post('/feed/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, text, avatarUrl = '' } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text is required' });

    if (getUseFallback()) {
      const data = await readFallbackData();
      const post = findFeedPost(data, id);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      if (!Array.isArray(post.comments)) post.comments = [];
      const comment = { userName: userName || 'Guest', avatarUrl, text: text.trim(), createdAt: new Date().toISOString() };
      post.comments.push(comment);
      await writeFallbackData(data);
      return res.json(comment);
    }

    const post = await Feed.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.comments.push({ userName: userName || 'Guest', avatarUrl, text: text.trim() });
    await post.save();
    res.json(post.comments[post.comments.length - 1]);
  } catch {
    res.status(500).json({ error: 'Server error commenting on post' });
  }
});

// Delete a post (author only)
router.delete('/feed/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body || {};

    if (getUseFallback()) {
      const data = await readFallbackData();
      const idx = data.feed.findIndex(p => (p._id === id || p.id === id) && p.userId === userId);
      if (idx === -1) return res.status(404).json({ error: 'Post not found' });
      data.feed.splice(idx, 1);
      await writeFallbackData(data);
      return res.json({ success: true });
    }

    const post = await Feed.findOneAndDelete({ _id: id, userId });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error deleting post' });
  }
});

export default router;
