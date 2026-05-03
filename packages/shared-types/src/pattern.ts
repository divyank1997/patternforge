export type PatternId = string;

export type PatternStyle = 'geometric' | 'organic' | 'fractal' | 'noise' | 'parametric';

export type PatternColorPalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
};

export interface PatternParameters {
  style: PatternStyle;
  complexity: number;
  scale: number;
  rotation: number;
  symmetry: number;
  colorPalette: PatternColorPalette;
  seed: number;
  customParams: Record<string, number | string | boolean>;
}

export interface Pattern {
  id: PatternId;
  userId: string;
  title: string;
  description: string;
  prompt: string;
  parameters: PatternParameters;
  thumbnailUrl?: string;
  isPublic: boolean;
  tags: string[];
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratePatternRequest {
  prompt: string;
  style?: PatternStyle;
  colorPalette?: Partial<PatternColorPalette>;
}

export interface GeneratePatternResponse {
  parameters: PatternParameters;
  explanation: string;
}
