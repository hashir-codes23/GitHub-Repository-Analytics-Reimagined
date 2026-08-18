import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Clock, Star, Trash2, Code2, Search } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useRecent } from '../hooks/useRecent';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/ui/States';
import Modal from '../components/ui/Modal';
import { formatNumber, timeAgo } from '../utils/format';

function RepoRow({ item, onOpen, onRemove, index }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
      transition={{ delay: index * 0.04 }}
    >
      <div className="card flex items-center gap-4 p-4 transition hover:shadow-lift">
        <img src={item.avatar} alt="" className="h-11 w-11 rounded-xl border border-brand-100" />
        <button onClick={onOpen} className="min-w-0 flex-1 text-left">
          <p className="truncate font-display font-semibold hover:text-brand-700 dark:hover:text-brand-300">
            {item.owner}/<span className="text-brand-600 dark:text-brand-400">{item.repo}</span>
          </p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-mute dark:text-stone-400">
            {item.stars != null && (
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 text-brand-600" /> {formatNumber(item.stars)}
              </span>
            )}
            {item.language && (
              <span className="inline-flex items-center gap-1">
                <Code2 className="h-3 w-3" /> {item.language}
              </span>
            )}
            {item.viewedAt && <span>Viewed {timeAgo(item.viewedAt)}</span>}
            {item.addedAt && <span>Saved {timeAgo(item.addedAt)}</span>}
          </p>
        </button>
        {onRemove && (
          <button
            onClick={onRemove}
            aria-label={`Remove ${item.owner}/${item.repo}`}
            className="rounded-lg p-2 text-ink-mute transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-white/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.li>
  );
}

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavorites();
  const { recent, clearRecent } = useRecent();
  const toast = useToast();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <span className="chip mb-4">
          <Heart className="h-4 w-4" /> Your collection
        </span>
        <h1 className="section-title">Favorites & Recent Searches</h1>
        <p className="mt-3 text-ink-soft dark:text-stone-300">Stored privately in your browser - nothing leaves your device.</p>
      </motion.div>

      <div className="grid gap-10 lg:grid-cols-2">
        <section aria-label="Favorite repositories">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
            <Heart className="h-5 w-5 text-brand-600" /> Favorites
            <span className="chip">{favorites.length}</span>
          </h2>
          {favorites.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No favorites yet"
              message="Open any repository and tap the Favorite button to pin it here."
            >
              <Link to="/" className="btn-primary">
                <Search className="h-4 w-4" /> Analyze a repository
              </Link>
            </EmptyState>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence>
                {favorites.map((f, i) => (
                  <RepoRow
                    key={`${f.owner}/${f.repo}`}
                    item={f}
                    index={i}
                    onOpen={() => navigate(`/analytics/${f.owner}/${f.repo}`)}
                    onRemove={() => {
                      removeFavorite(f.owner, f.repo);
                      toast.push('info', `${f.owner}/${f.repo} removed from favorites.`);
                    }}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </section>

        <section aria-label="Recently viewed repositories">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <Clock className="h-5 w-5 text-brand-600" /> Recent Searches
              <span className="chip">{recent.length}</span>
            </h2>
            {recent.length > 0 && (
              <button onClick={() => setConfirmClear(true)} className="text-xs font-semibold text-ink-mute transition hover:text-red-500">
                Clear history
              </button>
            )}
          </div>
          {recent.length === 0 ? (
            <EmptyState icon={Clock} title="No recent searches" message="Repositories you analyze will show up here for quick access." />
          ) : (
            <ul className="space-y-3">
              <AnimatePresence>
                {recent.map((r, i) => (
                  <RepoRow
                    key={`${r.owner}/${r.repo}`}
                    item={r}
                    index={i}
                    onOpen={() => navigate(`/analytics/${r.owner}/${r.repo}`)}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </section>
      </div>

      <Modal open={confirmClear} onClose={() => setConfirmClear(false)} title="Clear recent history?">
        <p className="text-sm text-ink-soft dark:text-stone-300">
          This removes all recently viewed repositories from this browser. Your favorites are kept.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" onClick={() => setConfirmClear(false)}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              clearRecent();
              setConfirmClear(false);
              toast.push('success', 'Recent history cleared.');
            }}
          >
            <Trash2 className="h-4 w-4" /> Clear history
          </button>
        </div>
      </Modal>
    </div>
  );
}
