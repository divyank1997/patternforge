'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { api, saveTokens } from '../../lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', username: '', displayName: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user, tokens } = await api.register(form);
      saveTokens(tokens, user);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Create account</h1>
          <p className="mt-2 text-zinc-400">Join PatternForge</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-300">Display Name</label>
            <input
              type="text"
              value={form.displayName}
              onChange={set('displayName')}
              required
              placeholder="Jane Doe"
              className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-300">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={set('username')}
              required
              placeholder="janedoe"
              pattern="^[a-zA-Z0-9_]+$"
              minLength={3}
              className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              required
              placeholder="you@example.com"
              className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              required
              minLength={8}
              placeholder="Min 8 characters"
              className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-10 rounded-lg bg-violet-600 font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-400 hover:text-violet-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
