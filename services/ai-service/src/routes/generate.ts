import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { generatePatternParameters } from '../lib/claude';
import jwt from 'jsonwebtoken';

const generateSchema = z.object({
  prompt: z.string().min(3).max(500),
});

const refineSchema = z.object({
  prompt: z.string().min(3).max(500),
  currentParameters: z.record(z.unknown()),
});

function getUser(req: { headers: { authorization?: string } }) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.slice(7), process.env['JWT_ACCESS_SECRET'] ?? 'dev-secret');
  } catch {
    return null;
  }
}

export async function generateRoutes(app: FastifyInstance) {
  app.post('/ai/generate', async (req, reply) => {
    const user = getUser(req);
    if (!user) {
      return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'Login required' } });
    }

    const result = generateSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: result.error.message } });
    }

    if (!process.env['ANTHROPIC_API_KEY'] || process.env['ANTHROPIC_API_KEY'] === 'your-api-key-here') {
      // Demo mode — return a mock response so frontend works without an API key
      return reply.send({
        success: true,
        data: getMockPattern(result.data.prompt),
      });
    }

    try {
      const data = await generatePatternParameters(result.data.prompt);
      return reply.send({ success: true, data });
    } catch (err) {
      app.log.error(err);
      return reply.status(500).send({ success: false, error: { code: 'AI_ERROR', message: 'Pattern generation failed' } });
    }
  });

  app.post('/ai/refine', async (req, reply) => {
    const user = getUser(req);
    if (!user) {
      return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'Login required' } });
    }

    const result = refineSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: result.error.message } });
    }

    if (!process.env['ANTHROPIC_API_KEY'] || process.env['ANTHROPIC_API_KEY'] === 'your-api-key-here') {
      return reply.send({ success: true, data: getMockPattern(result.data.prompt) });
    }

    try {
      const refinePrompt = `Current parameters: ${JSON.stringify(result.data.currentParameters)}\n\nUser refinement request: ${result.data.prompt}\n\nReturn updated parameters as JSON.`;
      const data = await generatePatternParameters(refinePrompt);
      return reply.send({ success: true, data });
    } catch (err) {
      app.log.error(err);
      return reply.status(500).send({ success: false, error: { code: 'AI_ERROR', message: 'Pattern refinement failed' } });
    }
  });
}

function getMockPattern(prompt: string) {
  const styles = ['geometric', 'organic', 'fractal', 'noise', 'parametric'] as const;
  const style = styles[prompt.length % styles.length] ?? 'geometric';
  return {
    parameters: {
      style,
      complexity: 0.6,
      scale: 2.5,
      rotation: 45,
      symmetry: 6,
      colorPalette: {
        primary: '#7C3AED',
        secondary: '#06B6D4',
        accent: '#F59E0B',
        background: '#0F0F1A',
      },
      seed: Math.floor(Math.random() * 99999),
      customParams: {
        speed: 0.3,
        density: 2.0,
        roughness: 0.4,
        metalness: 0.8,
        wireframe: false,
        emissiveIntensity: 0.5,
      },
    },
    explanation: `Demo mode: Generated a ${style} pattern. Add your ANTHROPIC_API_KEY to ai-service/.env for real AI generation.`,
  };
}
