import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './configurations/app-config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { User } from './users/user.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig], //Импортируем файл конфигурации
      isGlobal: true,
    }),
    // регистрируем модуль для асинхронной работы с базой данных
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USER') || 'postgres',
        password: configService.get('DB_PASSWORD') || '1961qwer',
        database: configService.get('DB_NAME') || 'postgres',
        autoLoadModels: true, // Автоматическая загрузка моделей
        synchronize: false, // Отключим автоматическую синхронизацию (используем миграции!)
        models: [User],
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
