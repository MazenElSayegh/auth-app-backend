import {
  MongooseModuleAsyncOptions,
  MongooseModuleFactoryOptions,
} from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { AppConfig } from 'src/config/app.config';

export const MongooseOptions: MongooseModuleAsyncOptions = {
  imports: [CommonModule],
  inject: [AppConfig],
  useFactory: (appConfig: AppConfig) => {
    const { Host, Port, Name, Username, Password } = appConfig.Config.Database;
    const options: MongooseModuleFactoryOptions = {
      uri: `mongodb://${Host}:${Port}/${Name}`,
    };
    if (Username && Password) {
      options.user = Username;
      options.pass = Password;
    }
    return options;
  },
};
