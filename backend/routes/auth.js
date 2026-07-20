import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { JWT_SECRET, authenticateToken } from '../middleware.js';

const router = express.Router();

// Helper to validate email format
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Helper to validate password strength (min 6 chars, at least one letter and one number)
const isValidPassword = (password) => {
  if (typeof password !== 'string') return false;
  if (password.length < 6) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
};

// Register Route with strong validations
router.post('/register', async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  email = email.trim();

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long and contain both letters and numbers' });
  }

  try {
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'An account is already registered with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.createUser({
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  email = email.trim();

  try {
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  let { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  email = email.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  try {
    const user = await db.findUserByEmail(email);
    
    // Always return success to prevent email enumeration attacks
    const successMsg = { message: 'If the email exists, a 6-digit reset code has been logged to the server terminal console.' };

    if (!user) {
      console.log(`[DEBUG forgot-password] Email ${email} not registered. Silently bypassing.`);
      return res.json(successMsg);
    }

    // Generate random 6-digit code
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins expiry

    await db.updateUser(user.id, {
      resetToken,
      resetTokenExpiry
    });

    console.log('\n========================================');
    console.log(`[PASSWORD RESET DEBUGLOG]`);
    console.log(`User: ${email}`);
    console.log(`Reset Token: ${resetToken}`);
    console.log(`Expires: ${new Date(resetTokenExpiry).toLocaleTimeString()}`);
    console.log('========================================\n');

    res.json(successMsg);
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ error: 'Server error during forgot password process' });
  }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  let { email, token, newPassword } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: 'Email, verification code, and new password are required' });
  }

  email = email.trim().toLowerCase();
  token = token.trim();

  if (!isValidPassword(newPassword)) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long and contain both letters and numbers' });
  }

  try {
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid reset attempt. User not found' });
    }

    if (!user.resetToken || user.resetToken !== token) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (!user.resetTokenExpiry || Date.now() > user.resetTokenExpiry) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Hash new password and clear token
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.updateUser(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    });

    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ error: 'Server error during password reset' });
  }
});

// Get/Update User Profile/Stats
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userWithoutSecrets = { ...user };
    delete userWithoutSecrets.password;
    delete userWithoutSecrets.resetToken;
    delete userWithoutSecrets.resetTokenExpiry;
    res.json(userWithoutSecrets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  const { age, weight, height, bmi, status, goal, username, avatarUrl, bio } = req.body;
  try {
    const updatedUser = await db.updateUserStats(req.userId, {
      age,
      weight,
      height,
      bmi,
      status,
      goal,
      username,
      avatarUrl,
      bio
    });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userWithoutSecrets = { ...updatedUser };
    delete userWithoutSecrets.password;
    delete userWithoutSecrets.resetToken;
    delete userWithoutSecrets.resetTokenExpiry;
    res.json(userWithoutSecrets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

export default router;
