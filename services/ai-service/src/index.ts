import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { generateRoutes } from './routes/generate';

const app = Fastify({ logger: { level: 'info' } });

const start = async () => {
  await app.register(cors, { origin: true, credentials: true });
  await app.register(generateRoutes);

  app.get('/health', async () => ({ status: 'ok', service: 'ai-service' }));

  try {
    await app.listen({ port: Number(process.env['PORT'] ?? 4004), host: '0.0.0.0' });
    app.log.info('ai-service running on port 4004');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
