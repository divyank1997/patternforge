const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4001';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json() as { success: boolean; data?: T; error?: { message: string } };
  if (!data.success) throw new Error(data.error?.message ?? 'Request failed');
  return data.data as T;
}

export const api = {
  register: (body: { email: string; username: string; password: string; displayName: string }) =>
    request<{ user: User; tokens: AuthTokens }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<{ user: User; tokens: AuthTokens }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  logout: (refreshToken: string) =>
    request<null>('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
};

export function saveTokens(tokens: AuthTokens, user: User) {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}
