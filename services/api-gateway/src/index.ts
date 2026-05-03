import Fastify from 'fastify';

const app = Fastify({ logger: true });

const SERVICE_ROUTES: Record<string, string> = {
  '/auth': process.env['AUTH_SERVICE_URL'] ?? 'http://localhost:4001',
  '/patterns': process.env['PATTERN_SERVICE_URL'] ?? 'http://localhost:4002',
  '/search': process.env['SEARCH_SERVICE_URL'] ?? 'http://localhost:4003',
  '/ai': process.env['AI_SERVICE_URL'] ?? 'http://localhost:4004',
  '/notifications': process.env['NOTIFICATION_SERVICE_URL'] ?? 'http://localhost:4005',
};

app.get('/health', async () => ({ status: 'ok', service: 'api-gateway' }));

app.get('/routes', async () => ({ routes: SERVICE_ROUTES }));

const start = async () => {
  try {
    await app.listen({ port: Number(process.env['PORT'] ?? 4000), host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
