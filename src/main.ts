import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from './config/app.config';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import * as mongoose from 'mongoose';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*', methods: '*' },
  });

  // Enable query sanitization to prevent NoSQL injection
  mongoose.set('sanitizeFilter', true);

  // Secure HTTP headers
  app.use(helmet());

  // Rate limiting middleware
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Too many requests, please try again later.',
    }),
  );

  // Enable validations
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: false,
    }),
  );

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('API documentation for authentication app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Load configuration
  const configService = app.get(ConfigService);
  const config = configService.get<Config>('Config');

  // Start app
  await app
    .listen(config?.Server.Port ?? 3000, config?.Server.Host ?? '127.0.0.1')
    .then(async () => {
      const url = await app.getUrl();
      console.log(`Server  running on ${url}`);
      console.log(`Swagger running on ${url}/api/docs`);
    });
}
bootstrap();
