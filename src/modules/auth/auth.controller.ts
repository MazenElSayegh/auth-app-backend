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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() data: AuthDto.LoginReq) {
    return this.authService.login(data);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() data: AuthDto.SignupReq) {
    return this.authService.signup(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Body() data: AuthDto.Session) {
    return this.authService.logout(data);
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Req() req: Request) {
    const user = req.user as any;
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader?.split(' ')[1];
    return this.authService.refreshToken({
      email: user.sub,
      sessionId: user.sessionId,
      refreshToken: refreshToken,
    });
  }
}
