import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env['ANTHROPIC_API_KEY'],
});

export const PATTERN_SYSTEM_PROMPT = `You are a 3D generative pattern design AI for PatternForge.

When given a text description of a pattern, you MUST respond with a single valid JSON object (no markdown, no explanation outside JSON) matching this exact schema:

{
  "parameters": {
    "style": "<geometric|organic|fractal|noise|parametric>",
    "complexity": <0.0-1.0>,
    "scale": <0.1-10.0>,
    "rotation": <0-360>,
    "symmetry": <1-12>,
    "colorPalette": {
      "primary": "<hex color>",
      "secondary": "<hex color>",
      "accent": "<hex color>",
      "background": "<hex color>"
    },
    "seed": <integer 1-99999>,
    "customParams": {
      "speed": <0.0-1.0>,
      "density": <0.1-5.0>,
      "roughness": <0.0-1.0>,
      "metalness": <0.0-1.0>,
      "wireframe": <true|false>,
      "emissiveIntensity": <0.0-2.0>
    }
  },
  "explanation": "<one sentence describing the pattern and why these parameters were chosen>"
}

Style guide:
- geometric: grids, polyhedra, symmetric tiling — use high symmetry (4-12)
- organic: waves, blobs, flowing surfaces — low symmetry (1-3), high complexity
- fractal: self-similar recursive structures — medium symmetry, high complexity
- noise: perlin/simplex noise displacement — low symmetry, variable complexity
- parametric: mathematical curves (rose, Lissajous, spirograph) — medium symmetry

Always pick colors that match the mood of the description. Dark backgrounds look best for 3D.`;

export async function generatePatternParameters(prompt: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: PATTERN_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0];
  if (text.type !== 'text') throw new Error('Unexpected response type from Claude');

  // Strip any accidental markdown fences
  const cleaned = text.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned) as {
    parameters: PatternParameters;
    explanation: string;
  };
}

export interface PatternParameters {
  style: 'geometric' | 'organic' | 'fractal' | 'noise' | 'parametric';
  complexity: number;
  scale: number;
  rotation: number;
  symmetry: number;
  colorPalette: { primary: string; secondary: string; accent: string; background: string };
  seed: number;
  customParams: {
    speed: number;
    density: number;
    roughness: number;
    metalness: number;
    wireframe: boolean;
    emissiveIntensity: number;
  };
}
