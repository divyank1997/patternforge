import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../lib/api';

interface User { id: string; email: string; username: string; displayName: string }

export function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored) as User);
  }, [navigate]);

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken') ?? '';
    fetch('http://localhost:4001/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }).finally(() => { clearTokens(); navigate('/login'); });
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white">
            {user.displayName[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">{user.displayName}</h1>
            <p className="text-sm text-zinc-400">@{user.username}</p>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Email</span>
            <span className="text-white">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">User ID</span>
            <span className="font-mono text-xs text-zinc-400">{user.id}</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-green-800 bg-green-950 px-4 py-3 text-sm text-green-400">
          Logged in successfully via JWT
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => navigate('/editor')}
            className="flex-1 rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
          >
            Open Editor
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 rounded-lg bg-zinc-800 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
