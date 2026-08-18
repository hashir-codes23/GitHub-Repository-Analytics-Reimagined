import { motion } from 'framer-motion';
import { Heart, ExternalLink, GitBranch, Calendar, Scale } from 'lucide-react';
import { formatDate, timeAgo } from '../../utils/format';

export default function RepoHeader({ repo, favorite, onToggleFavorite }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card mb-8 overflow-hidden"
    >
      <div className="h-1.5 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-200" />
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start gap-5">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={repo.owner.avatar}
            alt={`${repo.owner.login} avatar`}
            className="h-16 w-16 rounded-2xl border border-brand-200 shadow-card sm:h-20 sm:w-20"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{repo.fullName}</h1>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-1.5 text-ink-mute transition hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/10 dark:hover:text-brand-300"
                aria-label="Open repository on GitHub"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-1.5 max-w-2xl text-sm text-ink-soft dark:text-stone-300">
              {repo.description || 'No description provided.'}
            </p>
            {repo.topics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {repo.topics.slice(0, 8).map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-mute dark:text-stone-400">
              <span className="inline-flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5" /> {repo.defaultBranch}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5" /> {repo.license}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Created {formatDate(repo.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Updated {timeAgo(repo.pushedAt)}
              </span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onToggleFavorite}
            aria-pressed={favorite}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
              favorite
                ? 'border-brand-500 bg-brand-500 text-ink shadow-glow'
                : 'border-brand-200 bg-white text-ink-soft hover:border-brand-400 hover:text-ink dark:border-stone-700 dark:bg-white/5 dark:text-stone-300'
            }`}
          >
            <motion.span animate={favorite ? { scale: [1, 1.35, 1] } : {}} transition={{ duration: 0.35 }}>
              <Heart className={`h-4 w-4 ${favorite ? 'fill-ink' : ''}`} />
            </motion.span>
            {favorite ? 'Favorited' : 'Favorite'}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
