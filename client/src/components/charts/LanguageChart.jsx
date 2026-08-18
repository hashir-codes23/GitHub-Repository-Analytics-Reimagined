import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS, formatNumber } from '../../utils/format';

export default function LanguageChart({ languages }) {
  if (!languages?.length) {
    return (
      <ChartCard title="Language Distribution" subtitle="No language data reported for this repository.">
        <div className="flex h-64 items-center justify-center text-sm text-ink-mute">No data</div>
      </ChartCard>
    );
  }

  const top = languages.slice(0, 6);
  const rest = languages.slice(6);
  const data = [...top];
  if (rest.length) {
    data.push({
      name: 'Other',
      bytes: rest.reduce((a, b) => a + b.bytes, 0),
      percent: rest.reduce((a, b) => a + b.percent, 0)
    });
  }

  return (
    <ChartCard title="Language Distribution" subtitle="Share of codebase by bytes">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="h-56 w-full sm:w-1/2">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="bytes" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0} isAnimationActive animationDuration={900}>
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n, p) => [`${formatNumber(v)} bytes (${p.payload.percent.toFixed(1)}%)`, n]}
                contentStyle={{ borderRadius: 12, border: '1px solid #FFF59D', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="w-full space-y-2 sm:w-1/2">
          {data.map((d, i) => (
            <li key={d.name} className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 rounded-sm" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
              <span className="flex-1 truncate font-medium">{d.name}</span>
              <span className="text-xs text-ink-mute dark:text-stone-400">{d.percent.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}
