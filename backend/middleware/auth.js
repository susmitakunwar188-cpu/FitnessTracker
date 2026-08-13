/* global process */
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fitique-super-secret-key-13579';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;
    next();
  });
}

// Deterministic, stateless CSRF token bound to the authenticated user.
// The client receives it at login/register and sends it back in the
// `X-CSRF-Token` header on state-changing requests.
export function generateCsrfToken(userId) {
  return crypto.createHmac('sha256', JWT_SECRET).update(String(userId)).digest('hex');
}

// Protects state-changing (non-safe) requests against CSRF. Must run AFTER
// authenticateToken so that req.userId is populated. Safe methods (GET/HEAD/
// OPTIONS) pass through untouched.
export function validateCsrf(req, res, next) {
  const method = (req.method || '').toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return next();
  }

  const supplied = req.headers['x-csrf-token'];
  if (!supplied || supplied !== generateCsrfToken(req.userId)) {
    return res.status(403).json({ error: 'CSRF token invalid or missing. Please log in again.' });
  }

  next();
}

export { JWT_SECRET };
