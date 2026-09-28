'use client';

import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Pagination from '@mui/material/Pagination';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ProgressChart } from '@/components/ProgressChart';
import { StatCards } from '@/components/StatCards';
import { TaskDialog } from '@/components/TaskDialog';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskTable } from '@/components/TaskTable';
import type { Task, TaskInput } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useTasks } from '@/lib/useTasks';

interface Toast {
  message: string;
  severity: 'success' | 'error';
}

export default function DashboardPage() {
  const { session, signOut } = useAuth();
  const { filters, setFilter, stats, list, loading, error, create, update, toggleDone, remove } = useTasks(
    session?.accessToken ?? null,
    signOut,
  );

  const [dialog, setDialog] = useState<{ open: boolean; task: Task | null }>({ open: false, task: null });
  const [toDelete, setToDelete] = useState<Task | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  async function save(input: TaskInput) {
    if (dialog.task) await update(dialog.task.id, input);
    else await create(input);
    setDialog({ open: false, task: null });
    setToast({ message: dialog.task ? 'Task updated' : 'Task created', severity: 'success' });
  }

  async function toggle(task: Task) {
    try {
      await toggleDone(task);
    } catch (e) {
      setToast({ message: e instanceof Error ? e.message : 'Could not update the task', severity: 'error' });
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    const task = toDelete;
    setToDelete(null);
    try {
      await remove(task);
      setToast({ message: 'Task deleted', severity: 'success' });
    } catch (e) {
      setToast({ message: e instanceof Error ? e.message : 'Could not delete the task', severity: 'error' });
    }
  }

  const firstName = session?.user.name.split(' ')[0] ?? '';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Typography variant="h4" component="h1">
            Hi, {firstName}
          </Typography>
          <Typography color="text.secondary">Here is what is happening with your tasks.</Typography>
        </div>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog({ open: true, task: null })}>
          New task
        </Button>
      </div>

      {error && <Alert severity="error">{error}</Alert>}

      {stats ? <StatCards stats={stats} /> : <Skeleton variant="rounded" height={96} />}

      <div className="grid items-start gap-4 lg:grid-cols-[300px_1fr]">
        {stats ? <ProgressChart stats={stats} /> : <Skeleton variant="rounded" height={340} />}

        <Card className="space-y-4 p-4 sm:p-5">
          <Typography variant="h6">Tasks</Typography>
          <TaskFilters filters={filters} onChange={setFilter} />

          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rounded" height={52} />
              ))}
            </div>
          ) : list && list.items.length > 0 ? (
            <>
              <TaskTable
                tasks={list.items}
                onToggle={toggle}
                onEdit={(task) => setDialog({ open: true, task })}
                onDelete={setToDelete}
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Typography variant="body2" color="text.secondary">
                  {list.total} task{list.total === 1 ? '' : 's'} · page {list.page} of {list.pages}
                </Typography>
                <Pagination
                  count={list.pages}
                  page={filters.page}
                  onChange={(_, p) => setFilter('page', p)}
                  color="primary"
                  size="small"
                  siblingCount={0}
                />
              </div>
            </>
          ) : (
            <div className="py-10 text-center">
              <Typography color="text.secondary">
                {filters.search || filters.status || filters.priority
                  ? 'No tasks match your filters.'
                  : 'You have no tasks yet. Create your first one to get started.'}
              </Typography>
            </div>
          )}
        </Card>
      </div>

      {dialog.open && (
        <TaskDialog key={dialog.task?.id ?? 'new'} open task={dialog.task} onClose={() => setDialog({ open: false, task: null })} onSave={save} />
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete task?"
        message={toDelete ? `“${toDelete.title}” will be permanently deleted.` : ''}
        confirmLabel="Delete"
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </div>
  );
}
