import Link from 'next/link';

export default function AuthHomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">PatternForge</h1>
        <p className="mt-2 text-zinc-400">Sign in to start creating</p>
      </div>
      <div className="flex gap-4">
        <Link href="/login" className="rounded-lg bg-violet-600 px-6 py-3 font-medium hover:bg-violet-700 transition-colors">
          Login
        </Link>
        <Link href="/register" className="rounded-lg bg-zinc-800 px-6 py-3 font-medium hover:bg-zinc-700 transition-colors">
          Register
        </Link>
      </div>
    </div>
  );
}
