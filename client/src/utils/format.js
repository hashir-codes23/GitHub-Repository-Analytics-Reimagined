// Parses "owner/repo", full GitHub URLs and .git URLs.
export function parseRepoInput(input) {
  if (!input) return null;
  let s = input.trim();
  s = s
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\.git$/i, '')
    .replace(/\/+$/, '');
  if (s.toLowerCase().startsWith('github.com/')) s = s.slice(11);
  const parts = s.split('/').filter(Boolean);
  if (parts.length !== 2) return null;
  const [owner, repo] = parts;
  const valid = /^[A-Za-z0-9_.-]+$/;
  if (!valid.test(owner) || !valid.test(repo)) return null;
  return { owner, repo };
}

export function formatNumber(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

export function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function timeAgo(d) {
  if (!d) return '—';
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  if (s < 31536000) return `${Math.floor(s / 2592000)}mo ago`;
  return `${Math.floor(s / 31536000)}y ago`;
}

// Golden chart palette (yellow & white design system).
export const CHART_COLORS = ['#CA8A04', '#EAB308', '#FACC15', '#F59E0B', '#FBBF24', '#A16207', '#FDE047', '#78716C'];

export const CATEGORY_STYLES = {
  Excellent: 'bg-brand-600 text-white',
  Good: 'bg-brand-400 text-ink',
  Fair: 'bg-brand-200 text-brand-900',
  'Needs Attention': 'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-200'
};
