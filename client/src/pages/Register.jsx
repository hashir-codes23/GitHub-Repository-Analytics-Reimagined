import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiError } from '../services/api';
import { Spinner } from '../components/ui/Loaders';
import { LogoMark } from '../components/ui/Logo';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const user = await register(form.name, form.email, form.password);
      toast.push('success', `Account created - welcome, ${user.name}!`);
      navigate('/', { replace: true });
    } catch (err) {
      setError(apiError(err, 'Unable to create your account. Please try again.'));
    } finally {
      setBusy(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full name', type: 'text', icon: User, placeholder: 'Muhammad Hashir', autoComplete: 'name' },
    { key: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com', autoComplete: 'email' },
    { key: 'password', label: 'Password', type: 'password', icon: Lock, placeholder: 'At least 6 characters', autoComplete: 'new-password' },
    { key: 'confirm', label: 'Confirm password', type: 'password', icon: Lock, placeholder: 'Repeat your password', autoComplete: 'new-password' }
  ];

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="card w-full max-w-md overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-brand-600 via-brand-400 to-brand-200" />
        <div className="p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
              <LogoMark className="h-12 w-12" />
            </motion.div>
            <h1 className="mt-4 font-display text-2xl font-bold">Create your account</h1>
            <p className="mt-1 text-sm text-ink-soft dark:text-stone-400">Start analyzing GitHub repositories</p>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </motion.p>
          )}

          <form onSubmit={submit} className="space-y-4" noValidate>
            {fields.map((f) => (
              <label key={f.key} className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-stone-400">{f.label}</span>
                <div className="relative">
                  <f.icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
                  <input
                    type={f.type}
                    autoComplete={f.autoComplete}
                    className="input !pl-10"
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={set(f.key)}
                  />
                </div>
              </label>
            ))}
            <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={busy} className="btn-primary w-full !py-3">
              {busy ? <Spinner className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {busy ? 'Creating account…' : 'Create account'}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft dark:text-stone-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
