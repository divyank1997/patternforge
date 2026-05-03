import { create } from 'zustand';

export type PatternStyle = 'geometric' | 'organic' | 'fractal' | 'noise' | 'parametric';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface CustomParams {
  speed: number;
  density: number;
  roughness: number;
  metalness: number;
  wireframe: boolean;
  emissiveIntensity: number;
}

export interface PatternParameters {
  style: PatternStyle;
  complexity: number;
  scale: number;
  rotation: number;
  symmetry: number;
  colorPalette: ColorPalette;
  seed: number;
  customParams: CustomParams;
}

interface EditorState {
  parameters: PatternParameters;
  prompt: string;
  explanation: string;
  isGenerating: boolean;
  error: string;
  setParameters: (p: Partial<PatternParameters>) => void;
  setCustomParams: (p: Partial<CustomParams>) => void;
  setColorPalette: (p: Partial<ColorPalette>) => void;
  setPrompt: (p: string) => void;
  setExplanation: (e: string) => void;
  setGenerating: (v: boolean) => void;
  setError: (e: string) => void;
  randomize: () => void;
}

const DEFAULT_PARAMETERS: PatternParameters = {
  style: 'geometric',
  complexity: 0.5,
  scale: 2.5,
  rotation: 0,
  symmetry: 6,
  colorPalette: {
    primary: '#7C3AED',
    secondary: '#06B6D4',
    accent: '#F59E0B',
    background: '#0F0F1A',
  },
  seed: 42,
  customParams: {
    speed: 0.3,
    density: 2.0,
    roughness: 0.4,
    metalness: 0.8,
    wireframe: false,
    emissiveIntensity: 0.5,
  },
};

export const useEditorStore = create<EditorState>((set) => ({
  parameters: DEFAULT_PARAMETERS,
  prompt: '',
  explanation: '',
  isGenerating: false,
  error: '',

  setParameters: (p) =>
    set((state) => ({ parameters: { ...state.parameters, ...p } })),

  setCustomParams: (p) =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        customParams: { ...state.parameters.customParams, ...p },
      },
    })),

  setColorPalette: (p) =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        colorPalette: { ...state.parameters.colorPalette, ...p },
      },
    })),

  setPrompt: (prompt) => set({ prompt }),
  setExplanation: (explanation) => set({ explanation }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),

  randomize: () =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        seed: Math.floor(Math.random() * 99999),
        rotation: Math.random() * 360,
        complexity: Math.random(),
      },
    })),
}));
