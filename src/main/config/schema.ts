import { Type, Static } from '@sinclair/typebox';

export const ConfigSchema = Type.Object({
  general: Type.Object({
    env: Type.String({ default: 'development' }),
    tz: Type.String({ default: 'UTC' }),
    serviceName: Type.String({ default: 'venus-api' }),
  }),
  logger: Type.Object({
    level: Type.Union([Type.Literal('debug'), Type.Literal('info'), Type.Literal('warn'), Type.Literal('error')], { default: 'info' }),
  }),
  server: Type.Object({
    api: Type.Object({
      host: Type.String({ default: '0.0.0.0' }),
      port: Type.Number({ default: 8080 }),
      rateLimit: Type.Number({ default: 100 }),
      readTimeout: Type.String({ default: '5s' }),
      writeTimeout: Type.String({ default: '10s' }),
      idleTimeout: Type.String({ default: '120s' }),
      maxBodySize: Type.Number({ default: 1048576 }),
    }),
    cors: Type.Object({
      allowedOrigins: Type.Array(Type.String(), { default: ['*'] }),
      allowedMethods: Type.Array(Type.String(), { default: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] }),
      allowedHeaders: Type.Array(Type.String(), { default: ['Content-Type', 'Authorization'] }),
      exposedHeaders: Type.Array(Type.String(), { default: [] }),
      allowCredentials: Type.Boolean({ default: true }),
    }),
  }),
  db: Type.Object({
    driver: Type.String({ default: 'postgres' }),
    host: Type.String(),
    port: Type.Number({ default: 5432 }),
    user: Type.String(),
    password: Type.String(),
    name: Type.String(),
    sslMode: Type.String({ default: 'disable' }),
    connect: Type.Object({
      queryTimeout: Type.String({ default: '5s' }),
      execTimeout: Type.String({ default: '5s' }),
      backoff: Type.Object({
        min: Type.String({ default: '200ms' }),
        max: Type.String({ default: '15s' }),
        factor: Type.Number({ default: 2 }),
        jitter: Type.Boolean({ default: true }),
        retries: Type.Number({ default: 7 }),
      }),
    }),
    pool: Type.Object({
      maxOpenConns: Type.Number({ default: 20 }),
      maxIdleConns: Type.Number({ default: 10 }),
      connMaxLifetime: Type.String({ default: '15m' }),
      connMaxIdleTime: Type.String({ default: '5m' }),
      healthCheckPeriod: Type.String({ default: '1m' }),
    }),
  }),
  jwt: Type.Object({}),
});

export type Config = Static<typeof ConfigSchema>;
