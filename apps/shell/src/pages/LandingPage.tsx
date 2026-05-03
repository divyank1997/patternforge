import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-3xl">
        <div className="mb-6 inline-flex items-center rounded-full border border-violet-800 bg-violet-950/50 px-4 py-1.5 text-sm text-violet-300">
          AI-Powered · 3D · Generative Design
        </div>

        <h1 className="text-6xl font-bold tracking-tight text-white">
          Generate stunning{' '}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            3D patterns
          </span>{' '}
          with AI
        </h1>

        <p className="mt-6 text-xl text-zinc-400 leading-relaxed">
          Describe any pattern in plain English. PatternForge translates your vision
          into real-time 3D using Claude AI and React Three Fiber.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/editor')}
            className="rounded-xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-violet-700 transition-colors"
          >
            Open Editor
          </button>
          <button
            onClick={() => navigate('/register')}
            className="rounded-xl border border-zinc-700 px-8 py-3.5 text-base font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            Create account
          </button>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-6 text-left">
          {[
            { icon: '✦', title: 'AI Generation', desc: 'Claude AI translates text prompts into precise 3D pattern parameters instantly.' },
            { icon: '⬡', title: '5 Pattern Styles', desc: 'Geometric, organic, fractal, noise, and parametric — each rendering in real-time.' },
            { icon: '⚙', title: 'Full Control', desc: 'Fine-tune complexity, scale, symmetry, colors, and material properties live.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="mb-3 text-2xl text-violet-400">{icon}</div>
              <h3 className="mb-2 font-semibold text-white">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
