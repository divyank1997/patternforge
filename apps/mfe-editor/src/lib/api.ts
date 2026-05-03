import type { PatternParameters } from './store';

const AI_URL = import.meta.env.VITE_AI_SERVICE_URL ?? 'http://localhost:4004';

function getToken(): string | null {
  return localStorage.getItem('accessToken');
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json() as { success: boolean; data?: T; error?: { message: string } };
  if (!data.success) throw new Error(data.error?.message ?? 'Request failed');
  return data.data as T;
}

export async function generatePattern(prompt: string): Promise<{ parameters: PatternParameters; explanation: string }> {
  const token = getToken();
  return request(`${AI_URL}/ai/generate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ prompt }),
  });
}

export async function refinePattern(
  prompt: string,
  currentParameters: PatternParameters,
): Promise<{ parameters: PatternParameters; explanation: string }> {
  const token = getToken();
  return request(`${AI_URL}/ai/refine`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ prompt, currentParameters }),
  });
}
