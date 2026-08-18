import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

export default function ActivityChart({ activity }) {
  const total = activity?.reduce((a, b) => a + b.commits, 0) || 0;
  return (
    <ChartCard title="Commit Activity" subtitle={`Last 26 weeks · ${total} commits sampled`}>
      <div className="h-64">
        <ResponsiveContainer>
          <AreaChart data={activity} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="commitFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EAB308" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#EAB308" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#FDE68A" opacity={0.5} vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#A8A29E' }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: '#A8A29E' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #FFF59D', fontSize: 12 }} formatter={(v) => [`${v} commits`, 'Activity']} />
            <Area type="monotone" dataKey="commits" stroke="#CA8A04" strokeWidth={2.5} fill="url(#commitFill)" isAnimationActive animationDuration={1000} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
