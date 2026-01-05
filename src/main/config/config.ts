import { Value } from '@sinclair/typebox/value';
import { ConfigSchema, type Config } from './schema';

const mapEnvToConfig = () => ({
  general: {
    env: process.env.APP_GENERAL_ENV,
    tz: process.env.APP_GENERAL_TZ,
    serviceName: process.env.APP_GENERAL_SERVICE_NAME,
  },
  logger: {
    level: process.env.APP_LOGGER_LEVEL,
  },
  server: {
    api: {
      host: process.env.APP_SERVER_API_HOST,
      port: process.env.APP_SERVER_API_PORT ? Number(process.env.APP_SERVER_API_PORT) : undefined,
      rateLimit: process.env.APP_SERVER_API_RATE_LIMIT ? Number(process.env.APP_SERVER_API_RATE_LIMIT) : undefined,
      readTimeout: process.env.APP_SERVER_API_READ_TIMEOUT,
      writeTimeout: process.env.APP_SERVER_API_WRITE_TIMEOUT,
      idleTimeout: process.env.APP_SERVER_API_IDLE_TIMEOUT,
      maxBodySize: process.env.APP_SERVER_API_MAXBODYSIZE ? Number(process.env.APP_SERVER_API_MAXBODYSIZE) : undefined,
    },
    cors: {
      allowedOrigins: process.env.APP_SERVER_CORS_ALLOWEDORIGINS?.split(','),
      allowedMethods: process.env.APP_SERVER_CORS_ALLOWEDMETHODS?.split(','),
      allowedHeaders: process.env.APP_SERVER_CORS_ALLOWEDHEADERS?.split(','),
      exposedHeaders: process.env.APP_SERVER_CORS_EXPOSEDHEADERS?.split(','),
      allowCredentials: process.env.APP_SERVER_CORS_ALLOWCREDENTIALS === 'true',
    },
  },
  db: {
    driver: process.env.APP_DB_DRIVER,
    host: process.env.APP_DB_HOST,
    port: process.env.APP_DB_PORT ? Number(process.env.APP_DB_PORT) : undefined,
    user: process.env.APP_DB_USER,
    password: process.env.APP_DB_PASSWORD,
    name: process.env.APP_DB_NAME,
    sslMode: process.env.APP_DB_SSL_MODE,
    connect: {
      queryTimeout: process.env.APP_DB_CONNECT_QUERY_TIMEOUT,
      execTimeout: process.env.APP_DB_CONNECT_EXEC_TIMEOUT,
      backoff: {
        min: process.env.APP_DB_CONNECT_BACKOFF_MIN,
        max: process.env.APP_DB_CONNECT_BACKOFF_MAX,
        factor: process.env.APP_DB_CONNECT_BACKOFF_FACTOR ? Number(process.env.APP_DB_CONNECT_BACKOFF_FACTOR) : undefined,
        jitter: process.env.APP_DB_CONNECT_BACKOFF_JITTER === 'true',
        retries: process.env.APP_DB_CONNECT_BACKOFF_RETRIES ? Number(process.env.APP_DB_CONNECT_BACKOFF_RETRIES) : undefined,
      },
    },
    pool: {
      maxOpenConns: process.env.APP_DB_POOL_MAX_OPEN_CONNS ? Number(process.env.APP_DB_POOL_MAX_OPEN_CONNS) : undefined,
      maxIdleConns: process.env.APP_DB_POOL_MAX_IDLE_CONNS ? Number(process.env.APP_DB_POOL_MAX_IDLE_CONNS) : undefined,
      connMaxLifetime: process.env.APP_DB_POOL_CONN_MAX_LIFETIME,
      connMaxIdleTime: process.env.APP_DB_POOL_CONN_MAX_IDLE_TIME,
      healthCheckPeriod: process.env.APP_DB_POOL_HEALTH_CHECK_PERIOD,
    },
  },
  jwt: {
    secret: process.env.APP_JWT_SECRET,
    accessExpiry: process.env.APP_JWT_ACCESS_EXPIRY,
    refreshExpiry: process.env.APP_JWT_REFRESH_EXPIRY,
  },
});

export const loadConfig = (): Config => {
  const rawConfig = mapEnvToConfig();

  const configWithDefaults = Value.Cast(ConfigSchema, rawConfig);

  if (!Value.Check(ConfigSchema, configWithDefaults)) {
    const errors = [...Value.Errors(ConfigSchema, configWithDefaults)];
    console.error('❌ Invalid configuration:', JSON.stringify(errors, null, 2));
    throw new Error('Config validation failed');
  }

  return configWithDefaults;
};

export const config = loadConfig();
