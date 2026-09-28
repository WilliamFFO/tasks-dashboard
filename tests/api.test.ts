import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError } from '@/lib/api';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('api client', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('sends the bearer token and query string when listing tasks', async () => {
    fetchMock.mockResolvedValue(json({ items: [], total: 0, page: 1, limit: 8, pages: 1 }));
    await api.list('tok', { search: 'deploy', status: 'todo', priority: '', page: 2 });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('/tasks?');
    const query = new URL(url as string).searchParams;
    expect(query.get('search')).toBe('deploy');
    expect(query.get('status')).toBe('todo');
    expect(query.get('priority')).toBeNull();
    expect(query.get('page')).toBe('2');
    expect((init as RequestInit).headers).toMatchObject({ authorization: 'Bearer tok' });
  });

  it('turns API error bodies into ApiError with a readable message', async () => {
    fetchMock.mockResolvedValue(json({ message: 'Invalid credentials' }, 401));
    await expect(api.login('a@b.com', 'x')).rejects.toMatchObject({ name: 'Error', message: 'Invalid credentials', status: 401 });
  });

  it('joins validation error arrays', async () => {
    fetchMock.mockResolvedValue(json({ message: ['email must be an email', 'password is too short'] }, 400));
    await expect(api.register('Ana', 'x', 'y')).rejects.toThrow('email must be an email, password is too short');
  });

  it('returns a friendly message when the server cannot be reached', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    const error = await api.stats('tok').catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(0);
    expect(error.message).toMatch(/could not reach the server/i);
  });

  it('explains rate limiting', async () => {
    fetchMock.mockResolvedValue(json({ message: 'ThrottlerException: Too Many Requests' }, 429));
    await expect(api.login('a@b.com', 'x')).rejects.toThrow(/too many requests/i);
  });

  it('handles 204 responses when deleting', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(api.remove('tok', 'abc')).resolves.toBeUndefined();
  });
});
