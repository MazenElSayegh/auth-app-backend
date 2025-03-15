import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/data/database.module';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [DatabaseModule, JwtModule, CommonModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
