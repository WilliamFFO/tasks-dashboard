import type { Task } from './api';

/** Today's date as YYYY-MM-DD in the user's local time zone. */
export function todayISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** A task is overdue when it has a due date in the past and is not done yet. */
export function isOverdue(task: Pick<Task, 'dueDate' | 'status'>, today = todayISO()): boolean {
  return !!task.dueDate && task.status !== 'done' && task.dueDate.slice(0, 10) < today;
}

export function formatDate(value: string | null): string {
  if (!value) return '—';
  return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const STATUS_LABEL = { todo: 'To do', in_progress: 'In progress', done: 'Done' } as const;
export const PRIORITY_LABEL = { low: 'Low', medium: 'Medium', high: 'High' } as const;
