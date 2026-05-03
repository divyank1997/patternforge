import { Link, useNavigate, useLocation } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('user') ?? '{}') as { displayName?: string } : null;

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm transition-colors ${
        location.pathname === to ? 'text-violet-400 font-medium' : 'text-zinc-400 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="text-lg font-bold text-violet-400 tracking-tight">
          PatternForge
        </Link>

        <div className="flex items-center gap-6">
          {navLink('/', 'Home')}
          {navLink('/editor', 'Editor')}

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors">
                <div className="h-7 w-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold">
                  {user?.displayName?.[0]?.toUpperCase() ?? '?'}
                </div>
                {user?.displayName}
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">Sign in</Link>
              <button
                onClick={() => navigate('/register')}
                className="rounded-lg bg-violet-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
              >
                Get started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
