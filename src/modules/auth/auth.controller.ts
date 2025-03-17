import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: AuthDto.LoginReq })
  @ApiResponse({ status: 200, description: 'Successful login' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  login(@Body() data: AuthDto.LoginReq) {
    return this.authService.login(data);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @ApiOperation({ summary: 'Signup user' })
  @ApiBody({ type: AuthDto.SignupReq })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  signup(@Body() data: AuthDto.SignupReq) {
    return this.authService.signup(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiBody({ type: AuthDto.Session })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  logout(@Body() data: AuthDto.Session) {
    return this.authService.logout(data);
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'New access token issued' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  refreshToken(@Req() req: Request) {
    const user = req.user as AuthDto.Session;
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader?.split(' ')[1];
    return this.authService.refreshToken({
      email: user.email,
      sessionId: user.sessionId,
      refreshToken: refreshToken,
    });
  }
}
