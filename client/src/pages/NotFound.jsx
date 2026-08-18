import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-brand-500 to-brand-300 bg-clip-text font-display text-8xl font-bold text-transparent"
      >
        404
      </motion.p>
      <h1 className="mt-4 font-display text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-soft dark:text-stone-400">
        The page you are looking for drifted away like a particle. Let us get you back.
      </p>
      <Link to="/" className="btn-primary mt-8">
        <Home className="h-4 w-4" /> Back to home
      </Link>
    </div>
  );
}
