import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.interface';

const appConfig = registerAs<AppConfig>('app', (): AppConfig => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return {
    database: {
      host: process.env.POSTGRES_HOST || 'localhost',
      user: process.env.POSTGRES_USER || 'batya',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      password: process.env.POSTGRES_PASSWORD || '1961qwer',
      database: process.env.POSTGRES_DB || 'node_course',
    },
    api: {
      port: parseInt(process.env.PORT || '5000', 10),
    },
    jwt: {
      secret: jwtSecret,
      expiration: process.env.TOKEN_EXPIRATION || '3600s',
    },
  };
});

export default appConfig;
