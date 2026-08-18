import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from '../ui/CountUp';
import { CATEGORY_STYLES } from '../../utils/format';

const R = 56;
const CIRC = 2 * Math.PI * R;

export default function HealthScore({ health }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const target = CIRC * (1 - health.score / 100);

  return (
    <div ref={ref} className="card flex h-full flex-col p-6">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">DevPulse Health Score</h3>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${CATEGORY_STYLES[health.category] || CATEGORY_STYLES.Fair}`}>
          {health.category}
        </span>
      </div>
      <p className="text-xs text-ink-mute dark:text-stone-400">Custom heuristic score · not an official GitHub metric</p>

      <div className="my-6 flex items-center justify-center">
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 140 140" className="-rotate-90">
            <circle cx="70" cy="70" r={R} fill="none" strokeWidth="11" className="stroke-brand-100 dark:stroke-white/10" />
            <motion.circle
              cx="70"
              cy="70"
              r={R}
              fill="none"
              strokeWidth="11"
              strokeLinecap="round"
              className="stroke-brand-500"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={inView ? { strokeDashoffset: target } : {}}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              style={{ filter: 'drop-shadow(0 0 8px rgba(250,204,21,0.6))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold">
              <CountUp to={health.score} duration={1.4} />
            </span>
            <span className="text-xs font-medium text-ink-mute dark:text-stone-400">/ 100</span>
          </div>
        </div>
      </div>

      <ul className="space-y-3">
        {health.breakdown.map((b, i) => (
          <li key={b.key}>
            <div className="mb-1 flex justify-between text-xs font-medium">
              <span className="text-ink-soft dark:text-stone-300">{b.label}</span>
              <span className="text-ink-mute dark:text-stone-400">
                {b.score}/{b.max}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-brand-50 dark:bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
                initial={{ width: 0 }}
                animate={inView ? { width: `${(b.score / b.max) * 100}%` } : {}}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.08, ease: 'easeOut' }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
