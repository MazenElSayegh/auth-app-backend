import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*', methods: '*' },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
    }),
  );
  const configService = app.get(ConfigService);
  const config = configService.get<Config>('Config');
  await app
    .listen(config?.Server.Port ?? 3000, config?.Server.Host ?? '127.0.0.1')
    .then(async () => {
      const url = await app.getUrl();
      console.log(`Server  running on ${url}`);
      console.log(`Swagger running on ${url}/api`);
    });
}
bootstrap();
