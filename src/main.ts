import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import CORSPassThrough from 'src/utils/corse-middeleware';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // Включаем ValidationPipe
  const config = new DocumentBuilder()
    .setTitle('Авторизация')
    .setDescription('Разработка приложения')
    .setVersion('1.0')
    .addTag('Auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const configServiceInstance = app.get(ConfigService);
  const port = configServiceInstance.get<number>('PORT') || 3000;
  app.use(CORSPassThrough);
  await app.listen(port);
  Logger.log(`Server started at port ${port}`);
}
bootstrap();
