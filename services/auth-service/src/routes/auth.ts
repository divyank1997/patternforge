import type { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { signAccessToken, signRefreshToken, getRefreshExpiresAt } from '../lib/tokens';

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8),
  displayName: z.string().min(1).max(50),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (req, reply) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: result.error.message } });
    }

    const { email, username, password, displayName } = result.data;

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) {
      const field = existing.email === email ? 'email' : 'username';
      return reply.status(409).send({ success: false, error: { code: 'CONFLICT', message: `${field} already taken` } });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, username, displayName, passwordHash },
      select: { id: true, email: true, username: true, displayName: true, createdAt: true },
    });

    const accessToken = signAccessToken({ sub: user.id, email: user.email, username: user.username });
    const refreshTokenValue = signRefreshToken();

    await prisma.refreshToken.create({
      data: { token: refreshTokenValue, userId: user.id, expiresAt: getRefreshExpiresAt() },
    });

    return reply.status(201).send({
      success: true,
      data: { user, tokens: { accessToken, refreshToken: refreshTokenValue, expiresIn: 900 } },
    });
  });

  app.post('/login', async (req, reply) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: result.error.message } });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }

    const accessToken = signAccessToken({ sub: user.id, email: user.email, username: user.username });
    const refreshTokenValue = signRefreshToken();

    await prisma.refreshToken.create({
      data: { token: refreshTokenValue, userId: user.id, expiresAt: getRefreshExpiresAt() },
    });

    return reply.send({
      success: true,
      data: {
        user: { id: user.id, email: user.email, username: user.username, displayName: user.displayName },
        tokens: { accessToken, refreshToken: refreshTokenValue, expiresIn: 900 },
      },
    });
  });

  app.post('/refresh', async (req, reply) => {
    const result = refreshSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: { code: 'VALIDATION_ERROR', message: 'refreshToken required' } });
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: result.data.refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      return reply.status(401).send({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired refresh token' } });
    }

    await prisma.refreshToken.delete({ where: { id: stored.id } });

    const accessToken = signAccessToken({ sub: stored.user.id, email: stored.user.email, username: stored.user.username });
    const newRefreshToken = signRefreshToken();

    await prisma.refreshToken.create({
      data: { token: newRefreshToken, userId: stored.user.id, expiresAt: getRefreshExpiresAt() },
    });

    return reply.send({
      success: true,
      data: { tokens: { accessToken, refreshToken: newRefreshToken, expiresIn: 900 } },
    });
  });

  app.post('/logout', async (req, reply) => {
    const result = refreshSchema.safeParse(req.body);
    if (result.success) {
      await prisma.refreshToken.deleteMany({ where: { token: result.data.refreshToken } });
    }
    return reply.send({ success: true, data: null });
  });
}
