import { Module } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';
import { LoggerService } from './services/logger.service';

@Module({
  providers: [AppConfig, LoggerService],
  exports: [AppConfig, LoggerService],
})
export class CommonModule {}
