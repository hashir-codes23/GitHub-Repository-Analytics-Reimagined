import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompareArrows, Trophy, RotateCcw } from 'lucide-react';
import api, { apiError } from '../services/api';
import { parseRepoInput, formatNumber, CATEGORY_STYLES } from '../utils/format';
import { ErrorState } from '../components/ui/States';
import { SkeletonCard } from '../components/ui/Loaders';
import CompareRadar from '../components/charts/CompareRadar';

const ROWS = [
  { key: 'stars', label: 'Stars', get: (d) => d.repo.stars },
  { key: 'forks', label: 'Forks', get: (d) => d.repo.forks },
  { key: 'watchers', label: 'Watchers', get: (d) => d.repo.watchers },
  { key: 'issues', label: 'Open Issues', get: (d) => d.repo.openIssues, lowerWins: true },
  { key: 'contributors', label: 'Contributors', get: (d) => d.contributors.length },
  { key: 'size', label: 'Size (MB)', get: (d) => Math.round((d.repo.size || 0) / 1024) },
  { key: 'health', label: 'Health Score', get: (d) => d.health.score }
];

function RepoInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-stone-400">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="owner/repository"
        className="input"
        aria-label={label}
      />
    </label>
  );
}

export default function Compare() {
  const [inputA, setInputA] = useState('facebook/react');
  const [inputB, setInputB] = useState('vuejs/core');
  const [state, setState] = useState({ status: 'idle', a: null, b: null, error: null });

  const run = async (e) => {
    e?.preventDefault();
    const pa = parseRepoInput(inputA);
    const pb = parseRepoInput(inputB);
    if (!pa || !pb) {
      setState({ status: 'error', error: 'Enter both repositories in owner/repository format.', a: null, b: null });
      return;
    }
    setState({ status: 'loading', a: null, b: null, error: null });
    try {
      const [ra, rb] = await Promise.all([
        api.get(`/github/analyze/${pa.owner}/${pa.repo}`),
        api.get(`/github/analyze/${pb.owner}/${pb.repo}`)
      ]);
      setState({ status: 'success', a: ra.data, b: rb.data, error: null });
    } catch (err) {
      setState({ status: 'error', a: null, b: null, error: apiError(err) });
    }
  };

  const reset = () => setState({ status: 'idle', a: null, b: null, error: null });
  const { a, b } = state;
  const winner = a && b ? (a.health.score >= b.health.score ? a : b) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mb-10 max-w-2xl text-center">
        <span className="chip mb-4">
          <GitCompareArrows className="h-4 w-4" /> Head-to-head
        </span>
        <h1 className="section-title">Compare Repositories</h1>
        <p className="mt-3 text-ink-soft dark:text-stone-300">Put any two public GitHub repositories side by side.</p>
      </motion.div>

      <form onSubmit={run} className="card mx-auto mb-10 max-w-3xl p-6">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr_auto]">
          <RepoInput label="Repository A" value={inputA} onChange={setInputA} />
          <span className="hidden pb-3 font-display text-lg font-bold text-brand-600 sm:block">VS</span>
          <RepoInput label="Repository B" value={inputB} onChange={setInputB} />
          <button type="submit" className="btn-primary" disabled={state.status === 'loading'}>
            Compare
          </button>
        </div>
      </form>

      {state.status === 'loading' && (
        <div className="grid gap-6 lg:grid-cols-2" aria-busy="true">
          <SkeletonCard className="h-64" />
          <SkeletonCard className="h-64" />
          <SkeletonCard className="h-96 lg:col-span-2" />
        </div>
      )}

      {state.status === 'error' && <ErrorState title="Comparison failed" message={state.error} onRetry={run} />}

      {state.status === 'success' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* repo identity cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {[a, b].map((d, i) => (
              <motion.div
                key={d.repo.fullName}
                initial={{ opacity: 0, x: i === 0 ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`card relative overflow-hidden p-6 ${winner === d ? 'ring-2 ring-brand-500' : ''}`}
              >
                {winner === d && (
                  <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-ink shadow-glow">
                    <Trophy className="h-3.5 w-3.5" /> Winner
                  </span>
                )}
                <div className="flex items-center gap-4">
                  <img src={d.repo.owner.avatar} alt="" className="h-14 w-14 rounded-2xl border border-brand-200" />
                  <div>
                    <h2 className="font-display text-xl font-bold">{d.repo.fullName}</h2>
                    <p className="text-xs text-ink-mute dark:text-stone-400">{d.repo.language || 'N/A'} · {d.repo.license}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="font-display text-3xl font-bold text-brand-600 dark:text-brand-400">{d.health.score}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_STYLES[d.health.category]}`}>{d.health.category}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* metric-by-metric */}
          <div className="card p-6">
            <h3 className="mb-6 font-display text-lg font-semibold">Metric Breakdown</h3>
            <div className="space-y-5">
              {ROWS.map((row, ri) => {
                const va = row.get(a);
                const vb = row.get(b);
                const max = Math.max(va, vb, 1);
                const aWins = row.lowerWins ? va < vb : va > vb;
                const bWins = row.lowerWins ? vb < va : vb > va;
                return (
                  <motion.div
                    key={row.key}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: ri * 0.04 }}
                  >
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className={`font-semibold ${aWins ? 'text-brand-700 dark:text-brand-300' : 'text-ink-soft dark:text-stone-300'}`}>
                        {formatNumber(va)} {aWins && <Trophy className="inline h-3.5 w-3.5 text-brand-600" />}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-stone-400">{row.label}</span>
                      <span className={`font-semibold ${bWins ? 'text-brand-700 dark:text-brand-300' : 'text-ink-soft dark:text-stone-300'}`}>
                        {bWins && <Trophy className="inline h-3.5 w-3.5 text-brand-600" />} {formatNumber(vb)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-2.5 flex-1 justify-end overflow-hidden rounded-full bg-brand-50 dark:bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(va / max) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${aWins ? 'bg-gradient-to-l from-brand-600 to-brand-400' : 'bg-brand-200 dark:bg-stone-600'}`}
                        />
                      </div>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-brand-50 dark:bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(vb / max) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${bWins ? 'bg-gradient-to-r from-brand-600 to-brand-400' : 'bg-brand-200 dark:bg-stone-600'}`}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <CompareRadar a={a} b={b} />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card border-brand-300 bg-gradient-to-r from-brand-50 to-white p-6 text-center dark:from-night-card dark:to-night-soft"
          >
            <Trophy className="mx-auto mb-2 h-8 w-8 text-brand-600" />
            <p className="font-display text-lg font-semibold">
              Overall winner: <span className="text-brand-700 dark:text-brand-300">{winner.repo.fullName}</span>
            </p>
            <p className="mt-1 text-sm text-ink-soft dark:text-stone-400">
              Based on the DevPulse Health Score ({winner.health.score}/100).
            </p>
            <button onClick={reset} className="btn-ghost mt-5">
              <RotateCcw className="h-4 w-4" /> Compare other repositories
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
