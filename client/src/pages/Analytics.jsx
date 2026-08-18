import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, GitFork, Eye, CircleDot, Users, Database, Code2, Scale, GitPullRequest
} from 'lucide-react';
import api, { apiError } from '../services/api';
import { formatNumber } from '../utils/format';
import { useFavorites } from '../hooks/useFavorites';
import { useRecent } from '../hooks/useRecent';
import { useToast } from '../context/ToastContext';
import { DashboardSkeleton } from '../components/ui/Loaders';
import { ErrorState } from '../components/ui/States';
import RepoHeader from '../components/dashboard/RepoHeader';
import MetricCard from '../components/dashboard/MetricCard';
import HealthScore from '../components/dashboard/HealthScore';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import LanguageChart from '../components/charts/LanguageChart';
import ActivityChart from '../components/charts/ActivityChart';
import ContributorsChart from '../components/charts/ContributorsChart';
import SearchBar from '../components/SearchBar';

export default function Analytics() {
  const { owner, repo } = useParams();
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addRecent } = useRecent();
  const toast = useToast();

  const load = useCallback(
    async (signal) => {
      setState({ status: 'loading', data: null, error: null });
      try {
        const res = await api.get(`/github/analyze/${owner}/${repo}`, { signal });
        setState({ status: 'success', data: res.data, error: null });
        const r = res.data.repo;
        addRecent({ owner, repo, avatar: r.owner.avatar, stars: r.stars, language: r.language });
      } catch (err) {
        if (err.code === 'ERR_CANCELED') return;
        setState({ status: 'error', data: null, error: apiError(err) });
      }
    },
    [owner, repo, addRecent]
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  if (state.status === 'loading') return <DashboardSkeleton />;
  if (state.status === 'error') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto mb-10 max-w-xl">
          <SearchBar />
        </div>
        <ErrorState title="Could not analyze repository" message={state.error} onRetry={() => load()} />
      </div>
    );
  }

  const { data } = state;
  const { repo: r } = data;
  const fav = isFavorite(owner, repo);

  const onFavorite = () => {
    const added = toggleFavorite({ owner, repo, avatar: r.owner.avatar, stars: r.stars, language: r.language });
    toast.push('success', added ? `${r.fullName} added to favorites.` : `${r.fullName} removed from favorites.`);
  };

  const metrics = [
    { icon: Star, label: 'Stars', value: r.stars },
    { icon: GitFork, label: 'Forks', value: r.forks },
    { icon: Eye, label: 'Watchers', value: r.watchers },
    { icon: CircleDot, label: 'Open Issues', value: r.openIssues },
    { icon: Users, label: 'Contributors', value: data.contributors.length, sub: 'top 30 sampled' },
    { icon: GitPullRequest, label: 'Recent PRs', value: data.pulls.length, sub: 'latest 10' },
    { icon: Database, label: 'Size', value: Math.round((r.size || 0) / 1024), sub: 'MB' },
    { icon: Code2, label: 'Primary Language', value: r.language || 'N/A', numeric: false },
    { icon: Scale, label: 'License', value: r.license, numeric: false }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mb-8 max-w-xl">
        <SearchBar />
      </motion.div>

      <RepoHeader repo={r} favorite={fav} onToggleFavorite={onFavorite} />

      <section aria-label="Repository metrics" className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} {...m} delay={i * 0.05} />
        ))}
      </section>

      <section aria-label="Health score and language insights" className="mb-6 grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <HealthScore health={data.health} />
        </motion.div>
        <LanguageChart languages={data.languages} />
      </section>

      <section aria-label="Activity charts" className="mb-6 grid gap-6 lg:grid-cols-2">
        <ActivityChart activity={data.activity} />
        <ContributorsChart contributors={data.contributors} />
      </section>

      <section aria-label="Recent activity timeline" className="grid gap-6">
        <ActivityTimeline commits={data.recentCommits} pulls={data.pulls} issues={data.issues} releases={data.releases} />
      </section>
    </div>
  );
}
