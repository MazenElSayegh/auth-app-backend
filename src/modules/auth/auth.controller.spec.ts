import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { ExecutionContext } from '@nestjs/common';

class MockRefreshTokenGuard {
  canActivate(context: ExecutionContext) {
    return true;
  }
}
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ accessToken: 'mockAccessToken' }),
    signup: jest
      .fn()
      .mockResolvedValue({ message: 'User created successfully' }),
    logout: jest.fn().mockResolvedValue({ message: 'Successfully logged out' }),
    refreshToken: jest
      .fn()
      .mockResolvedValue({ accessToken: 'newMockAccessToken' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.login and return the access token', async () => {
      const loginDto: AuthDto.LoginReq = {
        email: 'test@example.com',
        password: 'password',
      };
      const result = await authController.login(loginDto);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({ accessToken: 'mockAccessToken' });
    });
  });

  describe('signup', () => {
    it('should call AuthService.signup and return success message', async () => {
      const signupDto: AuthDto.SignupReq = {
        email: 'test@example.com',
        password: 'password',
        name: 'test',
      };
      const result = await authController.signup(signupDto);
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual({ message: 'User created successfully' });
    });
  });

  describe('logout', () => {
    it('should call AuthService.logout and return success message', async () => {
      const sessionDto: AuthDto.Session = {
        email: 'test@example.com',
        sessionId: '123',
      };
      const result = await authController.logout(sessionDto);
      expect(authService.logout).toHaveBeenCalledWith(sessionDto);
      expect(result).toEqual({ message: 'Successfully logged out' });
    });
  });

  describe('refreshToken', () => {
    it('should call AuthService.refreshToken and return a new access token', async () => {
      const req = {
        user: { email: 'test@example.com', sessionId: '123' },
        headers: { authorization: 'Bearer mockRefreshToken' },
      } as any;
      const result = await authController.refreshToken(req);
      expect(authService.refreshToken).toHaveBeenCalledWith({
        email: 'test@example.com',
        sessionId: '123',
        refreshToken: 'mockRefreshToken',
      });
      expect(result).toEqual({ accessToken: 'newMockAccessToken' });
    });
  });

  describe('RefreshTokenGuard', () => {
    it('should allow execution when refresh token is valid', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { email: 'test@example.com' } }),
        }),
      } as unknown as ExecutionContext;

      const guard = new MockRefreshTokenGuard();
      expect(guard.canActivate(context)).toBe(true);
    });
  });
});
