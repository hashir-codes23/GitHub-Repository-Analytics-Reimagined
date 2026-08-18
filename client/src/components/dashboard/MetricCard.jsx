import { motion } from 'framer-motion';
import CountUp from '../ui/CountUp';
import { formatNumber } from '../../utils/format';

export default function MetricCard({ icon: Icon, label, value, sub, delay = 0, numeric = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -4 }}
      className="card group p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-stone-400">{label}</span>
        <span className="rounded-xl bg-brand-100 p-2 text-brand-700 transition group-hover:bg-brand-200 dark:bg-white/10 dark:text-brand-300">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {numeric ? <CountUp to={value || 0} format={(v) => formatNumber(Math.round(v))} /> : value || '—'}
      </p>
      {sub && <p className="mt-1 truncate text-xs text-ink-mute dark:text-stone-400">{sub}</p>}
    </motion.div>
  );
}
