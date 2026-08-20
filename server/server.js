import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import githubRoutes from './routes/github.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { ensureUserStore } from './services/userStore.js';

const app = express();

app.use(cors());
app.use(express.json());

// API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please slow down and try again shortly.'
  }
});

app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DevPulse API',
    time: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize user store
await ensureUserStore();

// Export for Vercel
export default app;

// Local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`DevPulse API running on http://localhost:${PORT}`);

    if (!process.env.GITHUB_TOKEN) {
      console.log(
        'GITHUB_TOKEN not set - using unauthenticated GitHub API (60 req/hour).'
      );
    }
  });
}