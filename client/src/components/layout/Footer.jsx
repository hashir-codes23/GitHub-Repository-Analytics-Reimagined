import { Link } from 'react-router-dom';
import { LogoMark } from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-100 bg-white/60 backdrop-blur dark:border-stone-800 dark:bg-night-soft/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8" />
          <div>
            <p className="font-display font-bold">
              Dev<span className="text-brand-600 dark:text-brand-400">Pulse</span>
            </p>
            <p className="text-xs text-ink-mute dark:text-stone-400">Powered by the GitHub REST API</p>
          </div>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-soft dark:text-stone-400" aria-label="Footer">
          <Link className="hover:text-brand-700 dark:hover:text-brand-300" to="/">Home</Link>
          <Link className="hover:text-brand-700 dark:hover:text-brand-300" to="/compare">Compare</Link>
          <Link className="hover:text-brand-700 dark:hover:text-brand-300" to="/favorites">Favorites</Link>
          <Link className="hover:text-brand-700 dark:hover:text-brand-300" to="/about">About</Link>
        </nav>
        <p className="text-center text-xs text-ink-mute dark:text-stone-500">
          Built by <span className="font-semibold text-brand-700 dark:text-brand-400">Muhammad Hashir</span> · Advanced Web Development Internship
        </p>
      </div>
    </footer>
  );
}
