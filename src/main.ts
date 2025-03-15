import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false, // this should be true once we add validations to all old endpoints
    }),
  );
  const configService = app.get(ConfigService);
  const config = configService.get<Config>('Config');
  await app.listen(3000);
}
bootstrap();
