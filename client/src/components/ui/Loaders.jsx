import { LogoMark } from './Logo';

export function Spinner({ className = 'h-5 w-5' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="animate-float">
        <LogoMark className="h-14 w-14" />
      </div>
      <p className="text-sm font-medium text-ink-soft dark:text-stone-400">Loading DevPulse…</p>
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return <div className={`shimmer rounded-2xl ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading repository analytics">
      <div className="mb-8 flex items-center gap-4">
        <SkeletonCard className="h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-3">
          <SkeletonCard className="h-6 w-1/3" />
          <SkeletonCard className="h-4 w-2/3" />
        </div>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <SkeletonCard className="h-80" />
        <SkeletonCard className="h-80" />
        <SkeletonCard className="h-80" />
      </div>
    </div>
  );
}
