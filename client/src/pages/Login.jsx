import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiError } from '../services/api';
import { Spinner } from '../components/ui/Loaders';
import { LogoMark } from '../components/ui/Logo';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      toast.push('success', `Welcome back, ${user.name}!`);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(apiError(err, 'Unable to sign in. Please try again.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="card w-full max-w-md overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-200" />
        <div className="p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
              <LogoMark className="h-12 w-12" />
            </motion.div>
            <h1 className="mt-4 font-display text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-ink-soft dark:text-stone-400">Sign in to analyze repositories</p>
          </div>

          {location.state?.from && (
            <p className="mb-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-center text-xs font-medium text-brand-800 dark:border-stone-700 dark:bg-white/5 dark:text-brand-300">
              Please sign in to continue to {location.state.from}
            </p>
          )}

          {error && (
            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </motion.p>
          )}

          <form onSubmit={submit} className="space-y-4" noValidate>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-stone-400">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
                <input
                  type="email"
                  autoComplete="email"
                  className="input !pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-stone-400">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
                <input
                  type="password"
                  autoComplete="current-password"
                  className="input !pl-10"
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </label>
            <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={busy} className="btn-primary w-full !py-3">
              {busy ? <Spinner className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {busy ? 'Signing in…' : 'Sign in'}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft dark:text-stone-400">
            New to DevPulse?{' '}
            <Link to="/register" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
