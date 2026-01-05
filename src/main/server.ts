import { Elysia } from 'elysia';
import { config } from '@main/config/config';
import { systemsRoutes } from '@infrastructure/http/routes/systems.routes';

const app = new Elysia()
  .use(systemsRoutes)
  .listen(config.server.api.port);

console.log(`🚀 ${config.general.serviceName} running on ${app.server?.hostname}:${app.server?.port}`);
