/* global process */
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import workoutsRouter from './routes/workouts.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*', // Allow all for local dev simplicity
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/workouts', workoutsRouter);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Fitique Backend is running on port ${PORT}`);
});
