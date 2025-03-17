import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [JwtModule, CommonModule],
  providers: [QuoteService, JwtStrategy],
  controllers: [QuoteController],
})
export class QuoteModule {}
