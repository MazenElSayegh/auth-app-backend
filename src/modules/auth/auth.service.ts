import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './auth.dto';
import { UserRepository } from 'src/repositories/user.repository';
import { AppConfig } from 'src/config/app.config';
import { SessionRepository } from 'src/repositories/session.repository';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
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
    return { email: existingUser.email, name: existingUser.name };
  }

  async login(user: AuthDto.LoginReq): Promise<AuthDto.LoginRes> {
    const validatedUser = await this.validateUser(user);
    const sessionId = uuidv4();
    const [accessToken, refreshToken] = [
      this.getSignedAccessToken(validatedUser.email, sessionId),
      this.getSignedRefreshToken(validatedUser.email, sessionId),
    ];
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const decodedRefreshToken = this.jwtService.decode(refreshToken);
    const expiresAt = new Date(decodedRefreshToken.exp * 1000);
    await this.sessionRepository.createSession({
      email: validatedUser.email,
      refreshToken: hashedRefreshToken,
      sessionId,
      expiresAt,
    });
    return {
      currentUser: validatedUser,
      accessToken,
      refreshToken,
      sessionId,
    };
  }

  async signup(user: AuthDto.SignupReq): Promise<AuthDto.User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.userRepository.createUser({
      ...user,
      password: hashedPassword,
    });
    return {
      email: newUser.email,
      name: newUser.name,
    };
  }

  async logout(session: AuthDto.Session): Promise<boolean> {
    const { email, sessionId } = session;
    const deleteResult = await this.sessionRepository.deleteSession({
      email,
      sessionId,
    });
    return deleteResult.deletedCount > 0;
  }

  async refreshToken(refreshReq: AuthDto.RefreshTokenReq) {
    const { email, refreshToken, sessionId } = refreshReq;
    const [user, session] = await Promise.all([
      this.userRepository.findUserByEmail(email),
      this.sessionRepository.findSession({
        email,
        sessionId,
      }),
    ]);
    const isExactSession = await bcrypt.compare(
      refreshToken ?? '',
      session?.refreshToken ?? '',
    );
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }
    if (!isExactSession) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return { accessToken: this.getSignedAccessToken(email, sessionId) };
  }

  private getSignedAccessToken(email: string, sessionId: string) {
    return this.jwtService.sign(
      {
        email,
        sessionId,
      },
      {
        algorithm: 'HS512',
        secret: this.appConfig.Config.Auth.Jwt.Key,
        expiresIn: '30s',
      },
    );
  }

  private getSignedRefreshToken(email: string, sessionId: string) {
    return this.jwtService.sign(
      {
        sub: email,
        sessionId,
      },
      {
        algorithm: 'HS512',
        secret: this.appConfig.Config.Auth.Jwt.Key,
        expiresIn: '600s',
      },
    );
  }
}
