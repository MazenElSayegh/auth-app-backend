import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from './config/app.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from './common/services/logger.service';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import * as mongoose from 'mongoose';

async function bootstrap() {
  // origin should be limited to allowed hosts only
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Enable query sanitization to prevent NoSQL injection
  mongoose.set('sanitizeFilter', true);

  // Secure HTTP headers
  app.use(helmet());

  // Rate limiting middleware
  // options are made according to business rules
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
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

  const logger = app.get(LoggerService);

  // Log unhandled rejection events
  process.on('unhandledRejection', async (error: any) => {
    logger.error('Unhandled rejection', error);
    process.exit(1); // Exit for a restart by supervisor
  });

  // Log uncaught exception events
  process.on('uncaughtException', async (error: any) => {
    logger.error('Uncaught exception', error);
    process.exit(1); // Exit for a restart by supervisor
  });

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
