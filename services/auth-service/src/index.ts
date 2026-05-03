import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/user';

const app = Fastify({ logger: { level: 'info' } });

const start = async () => {
  await app.register(cors, { origin: true, credentials: true });

  await app.register(jwt, {
    secret: {
      private: process.env['JWT_ACCESS_SECRET'] ?? 'dev-secret',
      public: process.env['JWT_ACCESS_SECRET'] ?? 'dev-secret',
    },
  });

  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(userRoutes, { prefix: '/auth' });

  app.get('/health', async () => ({ status: 'ok', service: 'auth-service' }));

  try {
    await app.listen({ port: Number(process.env['PORT'] ?? 4001), host: '0.0.0.0' });
    app.log.info('auth-service running on port 4001');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
