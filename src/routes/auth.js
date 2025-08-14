import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createUser, findUserByEmail, findUserById } from '../db.js';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function generateToken(user) {
  // 7-day token
  return jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' });

  const existing = findUserByEmail(email);
  if (existing) return res.status(409).json({ error: 'Email already in use' });

  const password_hash = bcrypt.hashSync(password, 10);
  const user = createUser({ name, email, password_hash });
  const token = generateToken(user);

  return res.status(201).json({ token, user });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const user = findUserByEmail(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken(user);
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

router.get('/me', authMiddleware, (req, res) => {
  const user = findUserById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user });
});

export default router;
