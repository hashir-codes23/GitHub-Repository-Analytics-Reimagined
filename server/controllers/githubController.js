import { getBundle } from '../services/githubService.js';

export async function analyze(req, res, next) {
  try {
    const { owner, repo } = req.params;
    if (!owner || !repo) {
      return res.status(400).json({ error: 'Both owner and repository name are required.' });
    }
    const data = await getBundle(owner, repo);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
