import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => ({ status: 'ok', service: 'ai-service' }));

const start = async () => {
  try {
    await app.listen({ port: Number(process.env['PORT'] ?? 4004), host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
