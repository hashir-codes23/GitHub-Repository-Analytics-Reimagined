import { motion } from 'framer-motion';

export default function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className={`card p-6 ${className}`}
    >
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {subtitle && <p className="mb-4 mt-0.5 text-xs text-ink-mute dark:text-stone-400">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}
