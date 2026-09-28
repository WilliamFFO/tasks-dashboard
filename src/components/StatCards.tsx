import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import type { Stats } from '@/lib/api';

const ITEMS = [
  { key: 'total', label: 'Total tasks', color: 'var(--mui-palette-primary-main)' },
  { key: 'todo', label: 'To do', color: 'var(--mui-palette-grey-500)' },
  { key: 'in_progress', label: 'In progress', color: 'var(--mui-palette-warning-main)' },
  { key: 'done', label: 'Done', color: 'var(--mui-palette-success-main)' },
] as const;

export function StatCards({ stats }: { stats: Stats }) {
  const value = (key: (typeof ITEMS)[number]['key']) => (key === 'total' ? stats.total : stats.byStatus[key]);
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {ITEMS.map((item) => (
        <Card key={item.key} className="p-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: item.color }} aria-hidden />
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
          </div>
          <Typography variant="h4" component="p" className="!mt-1">
            {value(item.key)}
          </Typography>
        </Card>
      ))}
    </div>
  );
}
