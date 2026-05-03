'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useEditorStore, type PatternStyle } from '../lib/store';
import { generatePattern, refinePattern } from '../lib/api';

// Canvas must be client-only (no SSR — WebGL not available server-side)
const PatternCanvas = dynamic(
  () => import('./PatternCanvas').then((m) => m.PatternCanvas),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center text-zinc-500">Loading 3D engine...</div> },
);

const STYLES: PatternStyle[] = ['geometric', 'organic', 'fractal', 'noise', 'parametric'];

export function EditorPage() {
  const {
    parameters, prompt, explanation, isGenerating, error,
    setParameters, setCustomParams, setColorPalette,
    setPrompt, setExplanation, setGenerating, setError, randomize,
  } = useEditorStore();

  const [tab, setTab] = useState<'ai' | 'manual'>('ai');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError('');
    try {
      const result = await generatePattern(prompt);
      setParameters(result.parameters);
      setExplanation(result.explanation);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleRefine = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError('');
    try {
      const result = await refinePattern(prompt, parameters);
      setParameters(result.parameters);
      setExplanation(result.explanation);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Refinement failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* LEFT PANEL */}
      <aside className="w-80 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-950 overflow-y-auto">
        {/* Header */}
        <div className="px-4 py-4 border-b border-zinc-800">
          <h1 className="text-lg font-bold text-violet-400">PatternForge</h1>
          <p className="text-xs text-zinc-500 mt-0.5">AI-Powered 3D Editor</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
          {(['ai', 'manual'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === t ? 'text-violet-400 border-b-2 border-violet-500' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t === 'ai' ? '✦ AI Generate' : '⚙ Manual'}
            </button>
          ))}
        </div>

        <div className="flex-1 px-4 py-4 space-y-4">
          {tab === 'ai' ? (
            /* AI TAB */
            <>
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Describe your pattern</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleGenerate(); }}
                  rows={4}
                  placeholder="e.g. A golden fractal snowflake with deep blue accents, symmetrical and intricate..."
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none resize-none"
                />
                <p className="text-xs text-zinc-600 mt-1">⌘ + Enter to generate</p>
              </div>

              {error && (
                <div className="rounded-lg border border-red-800 bg-red-950 px-3 py-2 text-xs text-red-400">{error}</div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex-1 rounded-lg bg-violet-600 py-2.5 text-sm font-medium hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Generating...
                    </span>
                  ) : '✦ Generate'}
                </button>
                <button
                  onClick={handleRefine}
                  disabled={isGenerating || !prompt.trim()}
                  className="rounded-lg border border-zinc-700 px-3 py-2.5 text-sm hover:bg-zinc-800 disabled:opacity-40 transition-colors"
                  title="Refine current pattern"
                >
                  ↺
                </button>
              </div>

              {explanation && (
                <div className="rounded-lg border border-violet-900 bg-violet-950/40 px-3 py-3 text-xs text-violet-300 leading-relaxed">
                  <span className="font-medium text-violet-400">AI: </span>{explanation}
                </div>
              )}

              <button
                onClick={randomize}
                className="w-full rounded-lg border border-zinc-700 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                ⟳ Randomize seed
              </button>
            </>
          ) : (
            /* MANUAL TAB */
            <>
              {/* Style */}
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-2 block">Style</label>
                <div className="grid grid-cols-3 gap-1">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setParameters({ style: s })}
                      className={`rounded-md py-1.5 text-xs font-medium capitalize transition-colors ${
                        parameters.style === s
                          ? 'bg-violet-600 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              {[
                { label: 'Complexity', key: 'complexity', min: 0, max: 1, step: 0.01 },
                { label: 'Scale', key: 'scale', min: 0.5, max: 6, step: 0.1 },
                { label: 'Rotation', key: 'rotation', min: 0, max: 360, step: 1 },
                { label: 'Symmetry', key: 'symmetry', min: 1, max: 12, step: 1 },
              ].map(({ label, key, min, max, step }) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-medium text-zinc-400">{label}</label>
                    <span className="text-xs text-zinc-500">
                      {Number(parameters[key as keyof typeof parameters]).toFixed(step < 1 ? 2 : 0)}
                    </span>
                  </div>
                  <input
                    type="range" min={min} max={max} step={step}
                    value={parameters[key as keyof typeof parameters] as number}
                    onChange={(e) => setParameters({ [key]: parseFloat(e.target.value) })}
                  />
                </div>
              ))}

              {/* Custom params */}
              <div className="pt-2 border-t border-zinc-800">
                <label className="text-xs font-medium text-zinc-400 mb-3 block">Material</label>
                {[
                  { label: 'Speed', key: 'speed', min: 0, max: 2, step: 0.01 },
                  { label: 'Roughness', key: 'roughness', min: 0, max: 1, step: 0.01 },
                  { label: 'Metalness', key: 'metalness', min: 0, max: 1, step: 0.01 },
                  { label: 'Glow', key: 'emissiveIntensity', min: 0, max: 2, step: 0.01 },
                ].map(({ label, key, min, max, step }) => (
                  <div key={key} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <label className="text-xs text-zinc-400">{label}</label>
                      <span className="text-xs text-zinc-500">
                        {Number(parameters.customParams[key as keyof typeof parameters.customParams]).toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range" min={min} max={max} step={step}
                      value={parameters.customParams[key as keyof typeof parameters.customParams] as number}
                      onChange={(e) => setCustomParams({ [key]: parseFloat(e.target.value) })}
                    />
                  </div>
                ))}
                <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={parameters.customParams.wireframe}
                    onChange={(e) => setCustomParams({ wireframe: e.target.checked })}
                    className="accent-violet-500"
                  />
                  Wireframe mode
                </label>
              </div>

              {/* Colors */}
              <div className="pt-2 border-t border-zinc-800">
                <label className="text-xs font-medium text-zinc-400 mb-2 block">Colors</label>
                {(['primary', 'secondary', 'accent', 'background'] as const).map((c) => (
                  <div key={c} className="flex items-center justify-between mb-2">
                    <label className="text-xs text-zinc-400 capitalize">{c}</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-600">{parameters.colorPalette[c]}</span>
                      <input
                        type="color"
                        value={parameters.colorPalette[c]}
                        onChange={(e) => setColorPalette({ [c]: e.target.value })}
                        className="h-6 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </aside>

      {/* 3D CANVAS */}
      <main className="flex-1 relative">
        <PatternCanvas params={parameters} />

        {/* Overlay info */}
        <div className="absolute bottom-4 left-4 flex gap-2 text-xs text-zinc-600">
          <span className="rounded bg-black/40 px-2 py-1">Scroll to zoom</span>
          <span className="rounded bg-black/40 px-2 py-1">Drag to orbit</span>
        </div>

        {/* Style badge */}
        <div className="absolute top-4 right-4">
          <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium capitalize text-violet-400 backdrop-blur">
            {parameters.style}
          </span>
        </div>
      </main>
    </div>
  );
}
