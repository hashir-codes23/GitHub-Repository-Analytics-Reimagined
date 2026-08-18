import { motion } from 'framer-motion';
import { HeartPulse, ShieldCheck, Database, Zap, Code2, GraduationCap } from 'lucide-react';

const POINTS = [
  { icon: HeartPulse, title: 'Health Score Methodology', desc: 'The DevPulse Health Score (0-100) is a custom heuristic - not an official GitHub metric. It blends recent activity (25), popularity (20), community (15), maintenance (20), documentation (10) and maturity (10).' },
  { icon: ShieldCheck, title: 'Authentication', desc: 'Accounts are secured with bcrypt password hashing and JWT sessions. Analytics endpoints are protected and require a valid token.' },
  { icon: Database, title: 'Real Data Only', desc: 'Every number comes from the official GitHub REST API. No scraping, no fake statistics, no placeholder content.' },
  { icon: Zap, title: 'Performance', desc: 'The Express server caches GitHub responses for 5 minutes, deduplicates requests, and the client lazy-loads every page.' }
];

export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <span className="chip mb-4">
          <Code2 className="h-4 w-4" /> About the project
        </span>
        <h1 className="section-title">About DevPulse</h1>
        <p className="mx-auto mt-4 max-w-2xl text-ink-soft dark:text-stone-300">
          DevPulse is a full-stack GitHub repository analytics platform built for the Advanced Web
          Development Internship. Enter any public repository and instantly get an interactive,
          animated dashboard of real GitHub data.
        </p>
      </motion.div>

      <div className="mb-12 grid gap-5 sm:grid-cols-2">
        {POINTS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="card p-6"
          >
            <div className="mb-3 inline-flex rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 p-3 text-ink shadow-glow">
              <p.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-semibold">{p.title}</h3>
            <p className="mt-1.5 text-sm text-ink-soft dark:text-stone-400">{p.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card p-8 text-center"
      >
        <GraduationCap className="mx-auto mb-3 h-9 w-9 text-brand-600" />
        <h2 className="font-display text-xl font-bold">Developer</h2>
        <p className="mt-2 text-sm text-ink-soft dark:text-stone-300">
          <span className="font-semibold">Muhammad Hashir</span>
          <br />
          hashirbaloch635@gmail.com
          <br />
          Advanced Web Development Internship Project
        </p>
        <p className="mt-4 text-xs text-ink-mute dark:text-stone-500">
          Stack: React · Vite · Tailwind CSS · Framer Motion · Recharts · Node.js · Express · JWT · GitHub REST API
        </p>
      </motion.div>
    </div>
  );
}
