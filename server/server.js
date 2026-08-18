import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import githubRoutes from './routes/github.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { ensureUserStore } from './services/userStore.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic API rate limiting (protects our server; GitHub rate limits are
// handled separately inside the GitHub service layer).
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down and try again shortly.' }
});
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DevPulse API', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);

app.use(notFound);
app.use(errorHandler);

await ensureUserStore();
app.listen(PORT, () => {
  console.log(`DevPulse API running on http://localhost:${PORT}`);
  if (!process.env.GITHUB_TOKEN) {
    console.log('GITHUB_TOKEN not set - using unauthenticated GitHub API (60 req/hour).');
  }
});
