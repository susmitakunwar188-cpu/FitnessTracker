/* global process */
import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Fitique AI, a friendly, motivating fitness coach for the Fitique app.
You help users with workouts, exercise form, nutrition, hydration, sleep, recovery, BMI, and staying consistent.
Keep answers concise (under 150 words), practical, and encouraging.
Use simple markdown (bold, bullet lists) when it helps readability.
If asked something unrelated to fitness or health, politely steer the conversation back to fitness.
Do not give medical diagnoses; recommend consulting a professional for serious concerns.`;

router.post('/', async (req, res) => {
  const { message, history } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured on the server' });
  }

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(Array.isArray(history) ? history.slice(-10) : []),
      { role: 'user', content: message.trim() }
    ];

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || 'Sorry, I could not generate a response. Please try again.';
    res.json({ reply });
  } catch (err) {
    console.error('Chat API Error:', err?.message || err);
    res.status(502).json({ error: 'Failed to reach the AI assistant. Please try again.' });
  }
});

export default router;
