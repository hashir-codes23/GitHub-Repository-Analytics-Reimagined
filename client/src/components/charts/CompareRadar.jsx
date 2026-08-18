import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ChartCard from './ChartCard';

// Normalized radar comparison - each axis scaled to the stronger repo.
export default function CompareRadar({ a, b }) {
  const norm = (x, y) => {
    const max = Math.max(x, y, 1);
    return [Math.round((x / max) * 100), Math.round((y / max) * 100)];
  };
  const commits = (d) => d.activity.reduce((s, w) => s + w.commits, 0);

  const rows = [
    ['Stars', a.repo.stars, b.repo.stars],
    ['Forks', a.repo.forks, b.repo.forks],
    ['Watchers', a.repo.watchers, b.repo.watchers],
    ['Contributors', a.contributors.length, b.contributors.length],
    ['Activity', commits(a), commits(b)],
    ['Health', a.health.score, b.health.score]
  ].map(([metric, x, y]) => {
    const [av, bv] = norm(x, y);
    return { metric, A: av, B: bv };
  });

  return (
    <ChartCard title="Head-to-Head Radar" subtitle="Each axis normalized to the stronger repository (100)">
      <div className="h-80">
        <ResponsiveContainer>
          <RadarChart data={rows}>
            <PolarGrid stroke="#FDE68A" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#57534E', fontWeight: 600 }} />
            <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
            <Radar name={a.repo.fullName} dataKey="A" stroke="#CA8A04" fill="#EAB308" fillOpacity={0.45} isAnimationActive />
            <Radar name={b.repo.fullName} dataKey="B" stroke="#1C1917" fill="#78716C" fillOpacity={0.3} isAnimationActive />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #FFF59D', fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
