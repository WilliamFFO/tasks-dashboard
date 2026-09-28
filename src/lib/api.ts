export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskList {
  items: Task[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Stats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  completionRate: number;
}

export interface Session {
  accessToken: string;
  user: { id: string; email: string; name: string };
}

export interface TaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface TaskFilters {
  status?: TaskStatus | '';
  priority?: TaskPriority | '';
  search?: string;
  page?: number;
  limit?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string | null): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new ApiError('Could not reach the server. Please check your connection and try again in a moment.', 0);
  }
  if (res.status === 429) {
    throw new ApiError('Too many requests. Please wait a minute and try again.', 429);
  }
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = Array.isArray(body.message) ? body.message.join(', ') : (body.message ?? message);
    } catch {
      /* body is not JSON */
    }
    throw new ApiError(message, res.status);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export const api = {
  /** Wakes the API up (free hosting plans put it to sleep when idle). Never throws. */
  wakeUp: () =>
    fetch(`${API_URL}/health`)
      .then(() => undefined)
      .catch(() => undefined),
  login: (email: string, password: string) =>
    request<Session>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) =>
    request<Session>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  stats: (token: string) => request<Stats>('/tasks/stats', {}, token),
  list: (token: string, f: TaskFilters) => {
    const q = new URLSearchParams();
    if (f.status) q.set('status', f.status);
    if (f.priority) q.set('priority', f.priority);
    if (f.search) q.set('search', f.search);
    q.set('page', String(f.page ?? 1));
    q.set('limit', String(f.limit ?? 8));
    return request<TaskList>(`/tasks?${q}`, {}, token);
  },
  create: (token: string, input: TaskInput) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(input) }, token),
  update: (token: string, id: string, input: Partial<TaskInput>) =>
    request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(input) }, token),
  remove: (token: string, id: string) => request<void>(`/tasks/${id}`, { method: 'DELETE' }, token),
};
