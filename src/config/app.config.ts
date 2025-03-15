import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Configuration from './configuration';
import {
  IsEnum,
  IsString,
  ValidateNested,
  ValidationError,
  validate,
} from 'class-validator';
import { Auth, Database, Server } from './app.config.model';
import { Type, plainToClass } from 'class-transformer';

export class Config {
  @ValidateNested()
  @Type(() => Server)
  Server: Server;

  @ValidateNested()
  @Type(() => Database)
  Database: Database;

  @ValidateNested()
  @Type(() => Auth)
  Auth: Auth;
}

@Injectable()
export class AppConfig implements OnModuleInit {
  constructor(
    @Inject(Configuration.KEY)
    public Config: ConfigType<typeof Configuration>,
  ) {}

  onModuleInit() {
    this.validateConfig();
  }

  async validateConfig() {
    const configDto = plainToClass(Config, this.Config);

    try {
      const errors: ValidationError[] = await validate(configDto);

      if (errors.length > 0) {
        console.error('Validation errors in the .env file:');
        this.displayValidationErrors(errors);
        process.exit(1); // Terminate the application if configuration is not valid
      }
    } catch (e) {
      console.error('An error occurred during validation:', e);
      process.exit(1); // Terminate the application if an error occurs
    }
  }

  displayValidationErrors(errors: ValidationError[], parentProperty = '') {
    errors.forEach((error) => {
      if (error.constraints) {
        console.error(
          `- Property "${parentProperty}${error.property}" failed validation: ${Object.values(
            error.constraints,
          ).join(', ')}`,
        );
      }
      if ((error.children && error.children.length) ?? 0 > 0) {
        this.displayValidationErrors(
          error?.children ?? [],
          `${error.property}.`,
        );
      }
    });
  }
}
