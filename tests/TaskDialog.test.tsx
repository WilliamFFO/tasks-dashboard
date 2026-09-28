import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TaskDialog } from '@/components/TaskDialog';
import type { Task } from '@/lib/api';

const task: Task = {
  id: '1',
  title: 'Write docs',
  description: 'README and Swagger',
  status: 'in_progress',
  priority: 'high',
  dueDate: '2026-12-31',
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
};

describe('TaskDialog', () => {
  it('disables Save until a title is entered and sends a trimmed payload', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TaskDialog open task={null} onClose={vi.fn()} onSave={onSave} />);

    const save = screen.getByRole('button', { name: 'Save' });
    expect(save).toBeDisabled();

    await user.type(screen.getByLabelText(/title/i), '  Ship v1  ');
    expect(save).toBeEnabled();
    await user.click(save);

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave).toHaveBeenCalledWith({
      title: 'Ship v1',
      description: undefined,
      status: 'todo',
      priority: 'medium',
      dueDate: undefined,
    });
  });

  it('pre-fills the form when editing', () => {
    render(<TaskDialog open task={task} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.getByText('Edit task')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toHaveValue('Write docs');
    expect(screen.getByLabelText(/description/i)).toHaveValue('README and Swagger');
    expect(screen.getByLabelText(/due date/i)).toHaveValue('2026-12-31');
  });

  it('shows the server error and stays open when saving fails', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('Title is too long'));
    const user = userEvent.setup();
    render(<TaskDialog open task={null} onClose={vi.fn()} onSave={onSave} />);

    await user.type(screen.getByLabelText(/title/i), 'x');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Title is too long')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });
});
