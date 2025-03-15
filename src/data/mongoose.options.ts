import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { AppConfig } from 'src/config/app.config';

export const MongooseOptions: MongooseModuleAsyncOptions = {
  imports: [CommonModule],
  inject: [AppConfig],
  useFactory: (appConfig: AppConfig) => ({
    uri: `mongodb://${appConfig.Config.Database.Host}:${appConfig.Config.Database.Port}/${appConfig.Config.Database.Name}`,
  }),
};
