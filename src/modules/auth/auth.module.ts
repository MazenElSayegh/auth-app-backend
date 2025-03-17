import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/data/database.module';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { RefreshStrategy } from 'src/auth/refresh.strategy';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';

@Module({
  imports: [DatabaseModule, JwtModule, CommonModule],
  providers: [AuthService, RefreshStrategy, RefreshTokenGuard],
  controllers: [AuthController],
})
export class AuthModule {}
