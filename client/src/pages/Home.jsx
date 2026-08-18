import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BarChart3, HeartPulse, PieChart, Users, GitCompareArrows, Activity,
  Sparkles, ArrowRight, Star, GitFork
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CountUp from '../components/ui/CountUp';

const FEATURES = [
  { icon: BarChart3, title: 'Repository Analytics', desc: 'Stars, forks, watchers, issues, PRs and more - pulled live from the GitHub API.' },
  { icon: HeartPulse, title: 'DevPulse Health Score', desc: 'A custom 0-100 score blending activity, popularity, community and maintenance signals.' },
  { icon: PieChart, title: 'Language Insights', desc: 'See exactly how a codebase is split across programming languages.' },
  { icon: Users, title: 'Contributor Analysis', desc: 'Meet the people behind the code with top-contributor rankings.' },
  { icon: GitCompareArrows, title: 'Repository Comparison', desc: 'Put any two repositories head-to-head with radar charts and winner badges.' },
  { icon: Activity, title: 'Activity Monitoring', desc: 'A live timeline of commits, pull requests, issues and releases.' }
];

const STEPS = [
  { n: '01', title: 'Enter Repository', desc: 'Paste a GitHub URL or type owner/repository - we validate it instantly.' },
  { n: '02', title: 'Analyze GitHub Data', desc: 'Our Node.js server fetches, caches and scores real GitHub API data.' },
  { n: '03', title: 'Explore Insights', desc: 'Interactive charts, health breakdowns, timelines and comparisons.' }
];

const TECH = ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Node.js', 'Express', 'JWT Auth', 'GitHub REST API'];

const SAMPLES = ['facebook/react', 'vercel/next.js', 'microsoft/vscode'];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
};

export default function Home() {
  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* soft glowing gradient blobs behind the hero */}
        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 animate-float-slow rounded-full bg-brand-300/40 blur-3xl dark:bg-brand-600/20" />
        <div className="pointer-events-none absolute -right-24 top-52 h-80 w-80 animate-float-slow rounded-full bg-brand-200/50 blur-3xl [animation-delay:-6s] dark:bg-brand-500/10" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="chip mb-6 !px-4 !py-1.5 !text-sm"
            >
              <Sparkles className="h-4 w-4" /> Live GitHub REST API data
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
            >
              GitHub Repository Analytics,{' '}
              <span className="bg-gradient-to-r from-brand-700 via-brand-500 to-brand-700 bg-clip-text text-transparent dark:from-brand-300 dark:via-brand-500 dark:to-brand-300">
                Reimagined.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mx-auto mt-5 max-w-xl text-base text-ink-soft sm:text-lg dark:text-stone-300"
            >
              DevPulse transforms raw GitHub repository data into meaningful, interactive analytics -
              health scores, language insights, contributor rankings and head-to-head comparisons.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mx-auto mt-8 max-w-xl"
            >
              <SearchBar size="hero" />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
                <span className="text-ink-mute dark:text-stone-400">Try:</span>
                {SAMPLES.map((s) => (
                  <Link key={s} to={`/analytics/${s}`} className="chip transition hover:border-brand-500 hover:bg-brand-100 dark:hover:bg-white/10">
                    {s}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* floating preview cards */}
          <div className="pointer-events-none relative mx-auto mt-16 hidden max-w-4xl lg:block" aria-hidden="true">
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="absolute -left-6 top-4 w-56 animate-float"
            >
              <div className="card p-5">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-ink-mute">
                  <Star className="h-3.5 w-3.5 text-brand-600" /> STARS
                </div>
                <p className="font-display text-3xl font-bold">
                  <CountUp to={228000} format={(v) => `${Math.round(v / 1000)}K`} duration={2} />
                </p>
                <div className="mt-3 flex h-12 items-end gap-1.5">
                  {[35, 55, 40, 70, 60, 90, 78, 100].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.7 + i * 0.08, duration: 0.5 }}
                      className="flex-1 rounded-t bg-gradient-to-t from-brand-600 to-brand-300"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="absolute -right-6 top-0 w-56 animate-float [animation-delay:-3s]"
            >
              <div className="card p-5">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-ink-mute">
                  <HeartPulse className="h-3.5 w-3.5 text-brand-600" /> HEALTH SCORE
                </div>
                <p className="font-display text-3xl font-bold text-brand-600">
                  <CountUp to={92} duration={2.2} />
                  <span className="text-base text-ink-mute"> /100</span>
                </p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-brand-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
                  />
                </div>
                <p className="mt-2 text-xs font-semibold text-brand-700">Excellent</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="mx-auto w-80"
            >
              <div className="card p-5 shadow-lift">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-ink-mute">
                  <GitFork className="h-3.5 w-3.5 text-brand-600" /> WEEKLY COMMITS
                </div>
                <div className="flex h-20 items-end gap-1">
                  {[20, 45, 30, 65, 50, 80, 55, 95, 70, 88, 60, 100].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.6 + i * 0.05, duration: 0.45 }}
                      className="flex-1 rounded-t bg-gradient-to-t from-brand-700 to-brand-400"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="section-title">Everything a repository tells you</h2>
          <p className="mt-3 text-ink-soft dark:text-stone-300">Six focused tools that turn raw GitHub data into decisions.</p>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="card group p-6"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 p-3 text-ink shadow-glow transition-transform group-hover:scale-110">
                <f.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-ink-soft dark:text-stone-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="border-y border-brand-100 bg-white/70 py-20 backdrop-blur dark:border-stone-800 dark:bg-night-soft/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="section-title">How it works</h2>
            <p className="mt-3 text-ink-soft dark:text-stone-300">Three steps from URL to insight.</p>
          </motion.div>
          <div className="grid gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15, duration: 0.55 }}
                className="relative text-center md:text-left"
              >
                <span className="bg-gradient-to-br from-brand-400 to-brand-200 bg-clip-text font-display text-6xl font-bold text-transparent dark:from-brand-500 dark:to-brand-700">
                  {s.n}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-soft dark:text-stone-400">{s.desc}</p>
                {i < 2 && <ArrowRight className="absolute -right-5 top-6 hidden h-6 w-6 text-brand-400 md:block" aria-hidden="true" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TECH ============ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Built with a modern stack</h2>
          <p className="mt-3 text-ink-soft dark:text-stone-300">Production-grade tools across the whole pipeline.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {TECH.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="chip !px-4 !py-2 !text-sm"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card relative overflow-hidden p-10 text-center sm:p-16"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-200/60 blur-3xl dark:bg-brand-600/20" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-brand-300/50 blur-3xl dark:bg-brand-500/10" />
          <h2 className="relative section-title">Ready to feel the pulse of your repo?</h2>
          <p className="relative mx-auto mt-3 max-w-md text-ink-soft dark:text-stone-300">
            Analyze any public GitHub repository in seconds - free, live and beautifully visualized.
          </p>
          <div className="relative mx-auto mt-8 max-w-xl">
            <SearchBar size="hero" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
