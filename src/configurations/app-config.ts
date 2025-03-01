import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.interface';

const appConfig = registerAs<AppConfig>('app', (): AppConfig => {
  const nodeEnv = process.env.NODE_ENV || 'production'; // Получаем значение NODE_ENV
  console.log(`Running in ${nodeEnv} environment`); // Выводим в консоль текущее окружение

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // Определяем значения переменных окружения в зависимости от NODE_ENV
  const postgresHost = process.env.POSTGRES_HOST || 'localhost';
  const postgresUser = process.env.POSTGRES_USER || 'batya';
  const postgresPort = parseInt(process.env.POSTGRES_PORT || '5432', 10);
  const postgresPassword = process.env.POSTGRES_PASSWORD || '1961qwer';
  const postgresDatabase = process.env.POSTGRES_DB || 'node_course';
  const apiPort = parseInt(process.env.PORT || '5000', 10);
  const tokenExpiration = process.env.TOKEN_EXPIRATION || '3600s';

  return {
    database: {
      host: postgresHost,
      user: postgresUser,
      port: postgresPort,
      password: postgresPassword,
      database: postgresDatabase,
    },
    api: {
      port: apiPort,
    },
    jwt: {
      secret: jwtSecret,
      expiration: tokenExpiration,
    },
  };
});

export default appConfig;
