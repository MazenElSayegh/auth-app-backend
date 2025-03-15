import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

// server object
export class Server {
  @IsString()
  Host: string;
  @IsNumber()
  Port: number;
}
// end of server

// database object
export class Database {
  @IsString()
  Host: string;

  @IsString()
  Username: string;

  @IsNumber()
  Port: number;

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
}
export class Auth {
  @ValidateNested()
  @Type(() => JWT)
  Jwt: JWT;
}
// end of auth
