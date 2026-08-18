import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { findByEmail, findById, createUser } from '../services/userStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'devpulse-dev-secret-change-me';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sign = (user) =>
  jwt.sign({ sub: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt });

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required.' });
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    if (await findByEmail(email)) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      passwordHash,
      createdAt: new Date().toISOString()
    };
    await createUser(user);
    res.status(201).json({ token: sign(user), user: publicUser(user) });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = await findByEmail(email);
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    const user = await findById(req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: publicUser(user) });
  } catch (e) {
    next(e);
  }
}
