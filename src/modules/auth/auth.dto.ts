import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export namespace AuthDto {
  export class LoginReq {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;
  }

  export class SignupReq {
    @IsNotEmpty({ message: 'Name is required' })
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/[A-Za-z]/, {
      message: 'Password must contain at least one letter',
    })
    @Matches(/\d/, { message: 'Password must contain at least one number' })
    @Matches(/[\W_]/, {
      message: 'Password must contain at least one special character',
    })
    password: string;
  }

  export interface Res {
    currentUser: User;
    accessToken: string;
    refreshToken: string;
  }
  export interface User {
    id: number;
    email: string;
  }
}
