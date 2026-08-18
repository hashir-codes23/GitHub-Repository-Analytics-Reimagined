// ============================================================
// DevPulse Health Score (0-100)
// A custom heuristic - NOT an official GitHub metric.
//
//   Recent Activity  25 pts  - how recently the repo was pushed to
//   Popularity       20 pts  - stars (12) + forks (8), log-scaled
//   Community        15 pts  - contributors (10) + watchers (5)
//   Maintenance      20 pts  - open-issue pressure (12) + PR flow (8)
//   Documentation    10 pts  - description (4) + license (3) + topics (3)
//   Maturity         10 pts  - repository age, saturates at ~3 years
// ============================================================

const daysSince = (d) => (d ? (Date.now() - new Date(d).getTime()) / 86400000 : Infinity);
const logScale = (value, cap) => Math.min(1, Math.log10((value || 0) + 1) / cap);

export function computeHealthScore({ meta, contributors = [], pulls = [] }) {
  const stars = meta.stargazers_count || 0;
  const openIssues = meta.open_issues_count || 0; // GitHub counts open PRs here too

  // Recent activity (25)
  const d = daysSince(meta.pushed_at);
  const recency = d <= 7 ? 25 : d <= 30 ? 21 : d <= 90 ? 15 : d <= 180 ? 9 : d <= 365 ? 5 : 2;

  // Popularity (20) - log scale so huge repos don't drown out small ones
  const popularity = Math.round(12 * logScale(stars, 5) + 8 * logScale(meta.forks_count, 4));

  // Community (15)
  const community = Math.round(
    10 * Math.min(1, contributors.length / 20) + 5 * logScale(meta.subscribers_count, 3)
  );

  // Maintenance (20)
  const issuePressure = Math.max(0, 1 - openIssues / (stars * 0.05 + 10));
  const maintenance = Math.round(12 * issuePressure + 8 * Math.min(1, pulls.length / 8));

  // Documentation (10)
  const documentation =
    (meta.description ? 4 : 0) + (meta.license ? 3 : 0) + Math.min(3, (meta.topics || []).length);

  // Maturity (10)
  const maturity = Math.round(10 * Math.min(1, daysSince(meta.created_at) / 1095));

  const score = Math.max(
    0,
    Math.min(100, recency + popularity + community + maintenance + documentation + maturity)
  );
  const category =
    score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Attention';

  return {
    score,
    category,
    isOfficial: false,
    label: 'DevPulse Health Score',
    breakdown: [
      { key: 'activity', label: 'Recent Activity', score: recency, max: 25 },
      { key: 'popularity', label: 'Popularity', score: popularity, max: 20 },
      { key: 'community', label: 'Community', score: community, max: 15 },
      { key: 'maintenance', label: 'Maintenance', score: maintenance, max: 20 },
      { key: 'documentation', label: 'Documentation', score: documentation, max: 10 },
      { key: 'maturity', label: 'Maturity', score: maturity, max: 10 }
    ]
  };
}
