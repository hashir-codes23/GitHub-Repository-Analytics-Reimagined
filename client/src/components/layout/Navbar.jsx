import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LogoMark } from '../ui/Logo';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/compare', label: 'Compare' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/about', label: 'About' }
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileOpen(false);
    toast.push('info', 'You have been signed out.');
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-brand-100 bg-white/85 shadow-card backdrop-blur-xl dark:border-stone-800 dark:bg-night/85'
          : 'border-transparent bg-white/40 backdrop-blur-md dark:bg-night/40'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2.5" aria-label="DevPulse home">
          <motion.div whileHover={{ rotate: -8, scale: 1.06 }} transition={{ type: 'spring', stiffness: 300 }}>
            <LogoMark />
          </motion.div>
          <span className="font-display text-xl font-bold tracking-tight">
            Dev<span className="text-brand-600 dark:text-brand-400">Pulse</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-ink dark:text-brand-300' : 'text-ink-soft hover:text-ink dark:text-stone-400 dark:hover:text-stone-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-500"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-xl border border-brand-200 bg-white/70 p-2.5 text-brand-700 transition hover:border-brand-400 hover:bg-brand-50 dark:border-stone-700 dark:bg-white/5 dark:text-brand-300"
          >
            <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.div>
          </button>

          {user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl border border-brand-200 bg-white/70 py-1.5 pl-1.5 pr-3 transition hover:border-brand-400 dark:border-stone-700 dark:bg-white/5"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-ink">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <span className="max-w-[7rem] truncate text-sm font-medium">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-ink-mute" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    className="card absolute right-0 mt-2 w-48 p-1.5"
                    role="menu"
                  >
                    <p className="truncate px-3 py-2 text-xs text-ink-mute dark:text-stone-400">{user.email}</p>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-brand-50 hover:text-ink dark:text-stone-300 dark:hover:bg-white/10"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="btn-ghost !px-4 !py-2">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2">
                Get started
              </Link>
            </div>
          )}

          <button
            className="rounded-xl border border-brand-200 bg-white/70 p-2.5 md:hidden dark:border-stone-700 dark:bg-white/5"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-brand-100 bg-white/95 backdrop-blur-xl md:hidden dark:border-stone-800 dark:bg-night/95"
          >
            <div className="space-y-1 px-4 py-4">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-medium ${
                      isActive
                        ? 'bg-brand-100 text-brand-900 dark:bg-white/10 dark:text-brand-300'
                        : 'text-ink-soft hover:bg-brand-50 dark:text-stone-300 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="pt-2">
                {user ? (
                  <button onClick={handleLogout} className="btn-ghost w-full">
                    <LogOut className="h-4 w-4" /> Sign out ({user.name})
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-ghost flex-1">
                      Sign in
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1">
                      Get started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
