import type { FastifyInstance } from 'fastify';
import { verifyAccessToken } from '../lib/tokens';
import { prisma } from '../lib/prisma';

export async function userRoutes(app: FastifyInstance) {
  app.get('/me', async (req, reply) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing token' } });
    }

    try {
      const payload = verifyAccessToken(authHeader.slice(7));
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, username: true, displayName: true, avatarUrl: true, createdAt: true },
      });

      if (!user) {
        return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
      }

      return reply.send({ success: true, data: { user } });
    } catch {
      return reply.status(401).send({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } });
    }
  });
}
