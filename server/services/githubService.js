import { cacheGet, cacheSet } from '../utils/cache.js';
import { ApiError } from '../middleware/errorHandler.js';
import { computeHealthScore } from '../utils/healthScore.js';

const API = 'https://api.github.com';
const TTL = 5 * 60 * 1000; // 5 minute cache

function headers() {
  const h = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'DevPulse-Analytics',
    'X-GitHub-Api-Version': '2022-11-28'
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

// Low-level fetch with caching + friendly error mapping.
async function gh(path, ttl = TTL) {
  const key = 'gh:' + path;
  const cached = cacheGet(key);
  if (cached) return cached;

  let res;
  try {
    res = await fetch(API + path, { headers: headers() });
  } catch {
    throw new ApiError(502, 'Unable to reach the GitHub API. Please check your network connection.');
  }

  if (res.status === 404) {
    throw new ApiError(404, 'Repository not found. Check the owner and repository name.');
  }
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get('x-ratelimit-remaining');
    if (remaining === '0' || res.status === 429) {
      throw new ApiError(
        429,
        'GitHub API rate limit exceeded. Add a GITHUB_TOKEN on the server or try again later.'
      );
    }
    throw new ApiError(502, 'The GitHub API rejected the request.');
  }
  if (!res.ok) throw new ApiError(502, 'The GitHub API returned an unexpected response.');

  const data = await res.json();
  cacheSet(key, data, ttl);
  return data;
}

// Tolerant variant: secondary endpoints may fail (e.g. commits on an
// empty repo) without killing the whole dashboard.
const safe = (path) => gh(path).catch(() => null);

function shapeRepo(meta) {
  return {
    name: meta.name,
    fullName: meta.full_name,
    url: meta.html_url,
    owner: {
      login: meta.owner?.login,
      avatar: meta.owner?.avatar_url,
      url: meta.owner?.html_url
    },
    description: meta.description,
    stars: meta.stargazers_count,
    forks: meta.forks_count,
    watchers: meta.subscribers_count,
    openIssues: meta.open_issues_count,
    language: meta.language,
    size: meta.size, // KB
    defaultBranch: meta.default_branch,
    license: meta.license?.spdx_id || 'None',
    topics: meta.topics || [],
    createdAt: meta.created_at,
    updatedAt: meta.updated_at,
    pushedAt: meta.pushed_at,
    homepage: meta.homepage,
    isFork: meta.fork,
    archived: meta.archived
  };
}

function shapeLanguages(languages) {
  if (!languages) return [];
  const total = Object.values(languages).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(languages)
    .map(([name, bytes]) => ({ name, bytes, percent: (bytes / total) * 100 }))
    .sort((a, b) => b.bytes - a.bytes);
}

// Aggregate the most recent ~100 commits into 26 weekly buckets.
function buildWeeklyActivity(commits) {
  const weeks = 26;
  const counts = new Array(weeks).fill(0);
  const now = Date.now();
  for (const c of commits || []) {
    const t = new Date(c.commit?.author?.date || 0).getTime();
    const w = Math.floor((now - t) / (7 * 86400000));
    if (w >= 0 && w < weeks) counts[weeks - 1 - w] += 1;
  }
  return counts.map((n, i) => {
    const d = new Date(now - (weeks - 1 - i) * 7 * 86400000);
    return {
      week: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      commits: n
    };
  });
}

export async function getBundle(owner, repo) {
  const base = `/repos/${owner}/${repo}`;
  // Repo metadata must succeed (drives the friendly 404); the rest are tolerant.
  const meta = await gh(base);
  const [languages, contributors, commits, pulls, issuesRaw, releases] = await Promise.all([
    safe(`${base}/languages`),
    safe(`${base}/contributors?per_page=30`),
    safe(`${base}/commits?per_page=100`),
    safe(`${base}/pulls?state=all&per_page=10`),
    safe(`${base}/issues?state=all&per_page=30`),
    safe(`${base}/releases?per_page=5`)
  ]);

  const issues = (issuesRaw || []).filter((i) => !i.pull_request); // issues endpoint also returns PRs

  return {
    repo: shapeRepo(meta),
    languages: shapeLanguages(languages),
    contributors: (contributors || []).map((c) => ({
      login: c.login,
      avatar: c.avatar_url,
      contributions: c.contributions,
      url: c.html_url
    })),
    recentCommits: (commits || []).slice(0, 8).map((c) => ({
      sha: c.sha?.slice(0, 7),
      message: (c.commit?.message || '').split('\n')[0],
      author: c.commit?.author?.name,
      avatar: c.author?.avatar_url,
      date: c.commit?.author?.date,
      url: c.html_url
    })),
    activity: buildWeeklyActivity(commits),
    pulls: (pulls || []).map((p) => ({
      title: p.title,
      state: p.merged_at ? 'merged' : p.state,
      user: p.user?.login,
      avatar: p.user?.avatar_url,
      date: p.created_at,
      url: p.html_url
    })),
    issues: issues.slice(0, 8).map((i) => ({
      title: i.title,
      state: i.state,
      user: i.user?.login,
      avatar: i.user?.avatar_url,
      date: i.created_at,
      url: i.html_url
    })),
    releases: (releases || []).map((r) => ({
      name: r.name || r.tag_name,
      tag: r.tag_name,
      date: r.published_at,
      url: r.html_url
    })),
    health: computeHealthScore({ meta, contributors: contributors || [], pulls: pulls || [], issues })
  };
}
