import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartCard from './ChartCard';

export default function ContributorsChart({ contributors }) {
  const data = (contributors || []).slice(0, 8).map((c) => ({ name: c.login, contributions: c.contributions }));
  return (
    <ChartCard title="Top Contributors" subtitle="By all-time contributions">
      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-ink-mute">No contributor data</div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#A8A29E' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11, fill: '#57534E' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #FFF59D', fontSize: 12 }} formatter={(v) => [`${v} contributions`, 'Contributor']} />
              <Bar dataKey="contributions" radius={[0, 8, 8, 0]} isAnimationActive animationDuration={900}>
                {data.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#CA8A04' : '#FACC15'} fillOpacity={1 - i * 0.08} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
