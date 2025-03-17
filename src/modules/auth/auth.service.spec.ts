import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../repositories/user.repository';
import { SessionRepository } from '../../repositories/session.repository';
import { AppConfig } from '../../config/app.config';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../../data/schemas/user.schema';
import { Session } from '../../data/schemas/session.schema';
import { AuthService } from './auth.service';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-session-id'),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userRepository: UserRepository;
  let sessionRepository: SessionRepository;
  let appConfig: AppConfig;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), decode: jest.fn() },
        },
        {
          provide: UserRepository,
          useValue: { findUserByEmail: jest.fn(), createUser: jest.fn() },
        },
        {
          provide: SessionRepository,
          useValue: {
            createSession: jest.fn(),
            deleteSession: jest.fn(),
            findSession: jest.fn(),
          },
        },
        {
          provide: AppConfig,
          useValue: {
            Config: {
              Auth: {
                Jwt: {
                  Key: 'test',
                  AccessTokenExpiration: '1hr',
                  RefreshTokenExpiration: '7d',
                },
              },
            },
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<UserRepository>(UserRepository);
    sessionRepository = module.get<SessionRepository>(SessionRepository);
    appConfig = module.get<AppConfig>(AppConfig);
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(null);
      await expect(
        authService['validateUser']({
          email: 'test@test.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue({
        email: 'test@test.com',
        password: 'hashedPassword',
      } as User);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
      await expect(
        authService['validateUser']({
          email: 'test@test.com',
          password: 'password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens on successful login', async () => {
      const user = { email: 'test@test.com', password: 'password' };
      const validatedUser = { email: 'test@test.com', name: 'Test User' };
      const sessionId = 'test-session-id';

      jest
        .spyOn(authService as any, 'validateUser')
        .mockResolvedValue(validatedUser);

      jest.spyOn(jwtService, 'sign').mockReturnValue('test-access-token');
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashed-refresh-token');

      jest.spyOn(sessionRepository, 'createSession').mockResolvedValue(null);

      const result = await authService.login(user);
      expect(result).toEqual({
        currentUser: validatedUser,
        accessToken: 'test-access-token',
        refreshToken: 'test-access-token',
        sessionId,
      });
    });
  });

  describe('signup', () => {
    it('should create and return a new user', async () => {
      const user = {
        email: 'test@test.com',
        password: 'password',
        name: 'Test User',
      };
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashed-password');
      jest.spyOn(userRepository, 'createUser').mockResolvedValue({
        email: 'test@test.com',
        name: 'Test User',
      } as User);

      const result = await authService.signup(user);
      expect(result).toEqual({
        email: 'test@test.com',
        name: 'Test User',
      } as User);
    });
  });

  describe('logout', () => {
    it('should delete session and return true if deleted', async () => {
      jest
        .spyOn(sessionRepository, 'deleteSession')
        .mockResolvedValue({ deletedCount: 1, acknowledged: true });
      const result = await authService.logout({
        email: 'test@test.com',
        sessionId: 'test-session',
      });
      expect(result).toBe(true);
    });
  });

  describe('refreshToken', () => {
    it('should return a new access token', async () => {
      const refreshReq = {
        email: 'test@test.com',
        refreshToken: 'token',
        sessionId: 'session',
      };
      jest
        .spyOn(userRepository, 'findUserByEmail')
        .mockResolvedValue({ email: 'test@test.com' } as User);
      jest
        .spyOn(sessionRepository, 'findSession')
        .mockResolvedValue({ refreshToken: 'hashed-token' } as Session);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('new-access-token');

      const result = await authService.refreshToken(refreshReq);
      expect(result).toEqual({ accessToken: 'new-access-token' });
    });
  });
});
