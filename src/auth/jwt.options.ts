import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { Config } from '../config/app.config';

export const JwtOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const Config = configService.get<Config>('Config');
    return {
      secret: Config?.Auth.Jwt.Key,
    };
  },
  inject: [ConfigService],
};
