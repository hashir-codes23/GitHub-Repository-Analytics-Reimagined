import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { analyze } from '../controllers/githubController.js';

const router = Router();
// All GitHub analytics endpoints require a valid JWT.
router.use(requireAuth);
router.get('/analyze/:owner/:repo', analyze);
export default router;
