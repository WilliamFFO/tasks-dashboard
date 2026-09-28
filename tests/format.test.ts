import { describe, expect, it } from 'vitest';
import { formatDate, isOverdue, todayISO } from '@/lib/format';

describe('todayISO', () => {
  it('formats a date as YYYY-MM-DD in local time', () => {
    expect(todayISO(new Date(2026, 8, 5))).toBe('2026-09-05');
    expect(todayISO(new Date(2026, 11, 31))).toBe('2026-12-31');
  });
});

describe('isOverdue', () => {
  it('is overdue when the due date is in the past and the task is not done', () => {
    expect(isOverdue({ dueDate: '2026-09-01', status: 'todo' }, '2026-09-26')).toBe(true);
    expect(isOverdue({ dueDate: '2026-09-01T00:00:00.000Z', status: 'in_progress' }, '2026-09-26')).toBe(true);
  });

  it('is not overdue when done, due today, due later or without a date', () => {
    expect(isOverdue({ dueDate: '2026-09-01', status: 'done' }, '2026-09-26')).toBe(false);
    expect(isOverdue({ dueDate: '2026-09-26', status: 'todo' }, '2026-09-26')).toBe(false);
    expect(isOverdue({ dueDate: '2026-10-01', status: 'todo' }, '2026-09-26')).toBe(false);
    expect(isOverdue({ dueDate: null, status: 'todo' }, '2026-09-26')).toBe(false);
  });
});

describe('formatDate', () => {
  it('formats dates without shifting the day across time zones', () => {
    expect(formatDate('2026-09-22')).toBe('Sep 22, 2026');
    expect(formatDate('2026-01-01T00:00:00.000Z')).toBe('Jan 1, 2026');
  });

  it('shows a dash when there is no date', () => {
    expect(formatDate(null)).toBe('—');
  });
});
