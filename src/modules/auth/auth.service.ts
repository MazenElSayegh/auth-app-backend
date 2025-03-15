import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './auth.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly appConfig: AppConfig,
  ) {}

  private async validateUser(user: AuthDto.LoginReq): Promise<AuthDto.User> {
    const existingUser = await this.userRepository.findUserByEmail(user.email);
    if (!existingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      user.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { email: existingUser.email, id: existingUser.id };
  }

  async login(user: AuthDto.LoginReq): Promise<AuthDto.Res> {
    const validatedUser = await this.validateUser(user);
    const { accessToken, refreshToken } = this.getSignedTokens({
      email: validatedUser.email,
      id: validatedUser.id,
    });
    return {
      currentUser: validatedUser,
      accessToken,
      refreshToken,
    };
  }

  async signup(user: AuthDto.SignupReq): Promise<AuthDto.Res> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.userRepository.createUser({
      ...user,
      password: hashedPassword,
    });
    const { accessToken, refreshToken } = this.getSignedTokens({
      email: newUser.email,
      id: newUser.id,
    });
    return {
      currentUser: { email: newUser.email, id: newUser.id },
      accessToken,
      refreshToken,
    };
  }

  private getSignedTokens(user: AuthDto.User) {
    return {
      accessToken: this.jwtService.sign(
        {
          email: user.email,
          id: user.id,
        },
        {
          algorithm: 'HS512', // Symmetric
          secret: this.appConfig.Config.Auth.Jwt.Key,
          expiresIn: '1h',
        },
      ),
      refreshToken: this.jwtService.sign(
        {
          sub: user.id,
        },
        {
          algorithm: 'HS512', // Symmetric
          secret: this.appConfig.Config.Auth.Jwt.Key,
          expiresIn: '10h',
        },
      ),
    };
  }
}
