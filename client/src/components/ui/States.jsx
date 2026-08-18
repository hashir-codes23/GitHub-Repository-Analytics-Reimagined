import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Inbox } from 'lucide-react';

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mx-auto max-w-lg p-10 text-center"
      role="alert"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 dark:bg-white/10">
        <AlertTriangle className="h-7 w-7 text-brand-700 dark:text-brand-400" />
      </div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-ink-soft dark:text-stone-400">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-6">
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      )}
    </motion.div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, message, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex flex-col items-center p-12 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 dark:bg-white/10">
        <Icon className="h-7 w-7 text-brand-700 dark:text-brand-400" />
      </div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-soft dark:text-stone-400">{message}</p>
      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  );
}
