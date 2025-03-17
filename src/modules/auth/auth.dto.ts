import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export namespace AuthDto {
  export class LoginReq {
    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    @Transform(({ value }) => sanitizeHtml(value))
    email: string;

    @ApiProperty({ example: 'P@ssw0rd!', description: 'User password' })
    @IsNotEmpty({ message: 'Password is required' })
    @Transform(({ value }) => sanitizeHtml(value))
    password: string;
  }

  export class SignupReq {
    @ApiProperty({
      example: 'John Doe',
      description: 'name of the user',
      minLength: 3,
    })
    @IsNotEmpty({ message: 'Name is required' })
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    @Transform(({ value }) => sanitizeHtml(value))
    name: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    @Transform(({ value }) => sanitizeHtml(value))
    email: string;

    @ApiProperty({
      example: 'P@ssw0rd!',
      description:
        'User password (must contain letters, numbers, and special characters)',
      minLength: 8,
    })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/[A-Za-z]/, {
      message: 'Password must contain at least one letter',
    })
    @Matches(/\d/, { message: 'Password must contain at least one number' })
    @Matches(/[\W_]/, {
      message: 'Password must contain at least one special character',
    })
    @Transform(({ value }) => sanitizeHtml(value))
    password: string;
  }

  export class Session {
    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: '12345abcde', description: 'Session ID' })
    @IsNotEmpty({ message: 'Session id is required' })
    @IsString({ message: 'Session id should be a string' })
    sessionId: string;
  }

  export class SessionReq extends Session {
    refreshToken: string;
    expiresAt: Date;
  }

  export class RefreshTokenReq extends Session {
    refreshToken?: string;
  }

  export class LoginRes {
    currentUser: User;
    accessToken: string;
    refreshToken: string;
    sessionId: string;
  }

  export class User {
    name: string;
    email: string;
  }
}
