import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, saveTokens } from '../lib/api';

export function RegisterPage() {
  const navigate = useNavigate();
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
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="mt-2 text-zinc-400">Join PatternForge</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-400">{error}</div>
          )}

          {[
            { label: 'Display Name', field: 'displayName', type: 'text', placeholder: 'Jane Doe' },
            { label: 'Username',     field: 'username',    type: 'text', placeholder: 'janedoe' },
            { label: 'Email',        field: 'email',       type: 'email', placeholder: 'you@example.com' },
            { label: 'Password',     field: 'password',    type: 'password', placeholder: 'Min 8 characters' },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-300">{label}</label>
              <input
                type={type}
                value={form[field as keyof typeof form]}
                onChange={set(field as keyof typeof form)}
                required placeholder={placeholder}
                minLength={field === 'password' ? 8 : field === 'username' ? 3 : undefined}
                className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          ))}

          <button
            type="submit" disabled={loading}
            className="mt-2 h-10 rounded-lg bg-violet-600 font-medium text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
