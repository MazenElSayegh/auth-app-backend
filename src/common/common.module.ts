import { Module } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';

@Module({
  providers: [AppConfig],
  exports: [AppConfig],
})
export class CommonModule {}
