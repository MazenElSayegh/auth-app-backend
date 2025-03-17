import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptions } from './auth/jwt.options';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth/jwt.strategy';
import { CommonModule } from './common/common.module';
import { MongooseOptions } from './data/mongoose.options';
import { QuoteModule } from './modules/quote/quote.module';
import Configuration from './config/configuration';
import { GlobalExceptionFilter } from './global/global.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Configuration],
      isGlobal: true,
      cache: true,
    }),
    AuthModule,
    MongooseModule.forRootAsync(MongooseOptions),
    {
      ...JwtModule.registerAsync(JwtOptions),
      global: true,
    },
    CommonModule,
    QuoteModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
