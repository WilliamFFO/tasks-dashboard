import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from '@/components/LoginForm';
import { ApiError, api } from '@/lib/api';
import { AuthProvider } from '@/lib/auth';

const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, push: vi.fn() }) }));

const session = { accessToken: 'jwt', user: { id: '1', email: 'ana@example.com', name: 'Ana Torres' } };

function setup() {
  return render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>,
  );
}

describe('LoginForm', () => {
  beforeEach(() => replace.mockClear());

  it('signs in, stores the session and redirects to the dashboard', async () => {
    const login = vi.spyOn(api, 'login').mockResolvedValue(session);
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByLabelText(/email/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'S3cure-pass');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith('/'));
    expect(login).toHaveBeenCalledWith('ana@example.com', 'S3cure-pass');
    expect(JSON.parse(localStorage.getItem('tasks-dashboard.session')!).accessToken).toBe('jwt');
  });

  it('shows the API error message on a failed login', async () => {
    vi.spyOn(api, 'login').mockRejectedValue(new ApiError('Invalid credentials', 401));
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByLabelText(/email/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('switches to registration and asks for a name', async () => {
    const register = vi.spyOn(api, 'register').mockResolvedValue(session);
    const user = userEvent.setup();
    setup();

    expect(screen.queryByLabelText(/^name/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Create account' }));
    await user.type(screen.getByLabelText(/^name/i), 'Ana Torres');
    await user.type(screen.getByLabelText(/email/i), 'ana@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'S3cure-pass');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => expect(register).toHaveBeenCalledWith('Ana Torres', 'ana@example.com', 'S3cure-pass'));
  });

  it('does not show a demo account by default', () => {
    setup();
    expect(screen.queryByText(/demo account/i)).not.toBeInTheDocument();
  });

  it('can reveal the password', async () => {
    const user = userEvent.setup();
    setup();
    const field = screen.getByLabelText(/^password/i);
    expect(field).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(field).toHaveAttribute('type', 'text');
  });
});
