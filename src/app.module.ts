import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptions } from './auth/jwt.options';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import Configuration from './config/configuration';
import { JwtStrategy } from './auth/jwt.strategy';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Configuration],
      isGlobal: true,
      cache: true,
    }),
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nestapp'),
    {
      ...JwtModule.registerAsync(JwtOptions),
      global: true,
    },
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
