'use client';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';
import type { Stats } from '@/lib/api';

export function ProgressChart({ stats }: { stats: Stats }) {
  const theme = useTheme();
  const p = theme.vars?.palette ?? theme.palette;
  const data = [
    { id: 'done', label: 'Done', value: stats.byStatus.done, color: p.success.main },
    { id: 'in_progress', label: 'In progress', value: stats.byStatus.in_progress, color: p.warning.main },
    { id: 'todo', label: 'To do', value: stats.byStatus.todo, color: p.grey[500] },
  ];
  const size = 200;

  return (
    <Card className="p-5">
      <Typography variant="h6" className="!mb-2">
        Progress
      </Typography>
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <PieChart
          width={size}
          height={size}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          hideLegend
          series={[{ data, innerRadius: 68, outerRadius: 96, paddingAngle: 2, cornerRadius: 4 }]}
          aria-label={`${stats.completionRate}% of tasks completed`}
        />
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <Typography variant="h4" component="p" className="!leading-none">
              {stats.completionRate}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              completed
            </Typography>
          </div>
        </div>
      </div>
      <ul className="mt-4 space-y-1.5 text-sm">
        {[...data].reverse().map((d) => (
          <li key={d.id} className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ background: d.color }} aria-hidden />
              {d.label}
            </span>
            <strong>{d.value}</strong>
          </li>
        ))}
      </ul>
    </Card>
  );
}
