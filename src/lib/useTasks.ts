'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError, type Stats, type Task, type TaskInput, type TaskList, type TaskPriority, type TaskStatus } from './api';
import { useDebounce } from './useDebounce';

export interface Filters {
  search: string;
  status: TaskStatus | '';
  priority: TaskPriority | '';
  page: number;
}

/**
 * Loads statistics and the current page of tasks, and exposes the mutations.
 * Filters live here so the UI components stay presentational.
 */
export function useTasks(token: string | null, onUnauthorized: () => void) {
  const [filters, setFilters] = useState<Filters>({ search: '', status: '', priority: '', page: 1 });
  const [stats, setStats] = useState<Stats | null>(null);
  const [list, setList] = useState<TaskList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = useDebounce(filters.search, 300);
  const { status, priority, page } = filters;

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const [s, l] = await Promise.all([api.stats(token), api.list(token, { search, status, priority, page })]);
      setStats(s);
      setList(l);
      setError('');
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        onUnauthorized();
        return;
      }
      setError(e instanceof Error ? e.message : 'Could not load tasks');
    } finally {
      setLoading(false);
    }
  }, [token, search, status, priority, page, onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((f) => ({ ...f, [key]: value, ...(key === 'page' ? {} : { page: 1 }) }));
  }, []);

  const create = useCallback(
    async (input: TaskInput) => {
      if (!token) return;
      await api.create(token, input);
      await load();
    },
    [token, load],
  );

  const update = useCallback(
    async (id: string, input: Partial<TaskInput>) => {
      if (!token) return;
      await api.update(token, id, input);
      await load();
    },
    [token, load],
  );

  /** Optimistic toggle: the checkbox flips immediately and rolls back to server state if the request fails. */
  const toggleDone = useCallback(
    async (task: Task) => {
      if (!token) return;
      const next: TaskStatus = task.status === 'done' ? 'todo' : 'done';
      setList((l) => (l ? { ...l, items: l.items.map((t) => (t.id === task.id ? { ...t, status: next } : t)) } : l));
      try {
        await api.update(token, task.id, { status: next });
      } catch (e) {
        await load();
        throw e;
      }
      await load();
    },
    [token, load],
  );

  const remove = useCallback(
    async (task: Task) => {
      if (!token) return;
      await api.remove(token, task.id);
      // Removing the last item of a page moves back one page.
      if (list && list.items.length === 1 && page > 1) setFilters((f) => ({ ...f, page: f.page - 1 }));
      else await load();
    },
    [token, list, page, load],
  );

  return { filters, setFilter, stats, list, loading, error, create, update, toggleDone, remove, reload: load };
}
