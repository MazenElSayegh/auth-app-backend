import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// server object
export class Server {
  @IsOptional()
  @IsString()
  Host: string;

  @IsOptional()
  @IsNumber()
  Port: number;
}
// end of server

// database object
export class Database {
  @IsString()
  Host: string;

  @IsNumber()
  Port: number;

  @IsOptional()
  @IsString()
  Username: string;

  @IsOptional()
  @IsString()
  Password: string;

  @IsString()
  Name: string;
}
// end of database

// auth object
export class JWT {
  @IsString()
  Key: string;

  @IsString()
  AccessTokenExpiration: string;

  @IsString()
  RefreshTokenExpiration: string;
}
export class Auth {
  @ValidateNested()
  @Type(() => JWT)
  Jwt: JWT;
}
// end of auth
