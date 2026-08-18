import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitCommitHorizontal, GitPullRequest, CircleDot, Tag } from 'lucide-react';
import { timeAgo } from '../../utils/format';

const TYPE_META = {
  commit: { icon: GitCommitHorizontal, label: 'Commit', cls: 'bg-brand-500 text-ink' },
  pull: { icon: GitPullRequest, label: 'Pull request', cls: 'bg-brand-700 text-white' },
  issue: { icon: CircleDot, label: 'Issue', cls: 'bg-brand-300 text-ink' },
  release: { icon: Tag, label: 'Release', cls: 'bg-ink text-brand-400 dark:bg-brand-500 dark:text-ink' }
};

export default function ActivityTimeline({ commits = [], pulls = [], issues = [], releases = [] }) {
  const items = useMemo(() => {
    const all = [
      ...commits.map((c) => ({ type: 'commit', date: c.date, title: c.message, sub: c.author, url: c.url })),
      ...pulls.map((p) => ({ type: 'pull', date: p.date, title: p.title, sub: `${p.user} · ${p.state}`, url: p.url })),
      ...issues.map((i) => ({ type: 'issue', date: i.date, title: i.title, sub: `${i.user} · ${i.state}`, url: i.url })),
      ...releases.map((r) => ({ type: 'release', date: r.date, title: r.name, sub: r.tag, url: r.url }))
    ];
    return all
      .filter((x) => x.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 12);
  }, [commits, pulls, issues, releases]);

  return (
    <div className="card h-full p-6">
      <h3 className="mb-5 font-display text-lg font-semibold">Recent Activity</h3>
      {items.length === 0 ? (
        <p className="text-sm text-ink-mute dark:text-stone-400">No recent activity available for this repository.</p>
      ) : (
        <ol className="relative ml-2 space-y-5 border-l-2 border-brand-100 pl-6 dark:border-stone-800">
          {items.map((item, i) => {
            const meta = TYPE_META[item.type];
            const Icon = meta.icon;
            return (
              <motion.li
                key={`${item.type}-${i}`}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative"
              >
                <span className={`absolute -left-[35px] flex h-6 w-6 items-center justify-center rounded-full shadow-card ${meta.cls}`}>
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <a href={item.url} target="_blank" rel="noreferrer" className="group block">
                  <p className="line-clamp-1 text-sm font-medium group-hover:text-brand-700 dark:group-hover:text-brand-300">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-mute dark:text-stone-400">
                    {meta.label} · {item.sub} · {timeAgo(item.date)}
                  </p>
                </a>
              </motion.li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
