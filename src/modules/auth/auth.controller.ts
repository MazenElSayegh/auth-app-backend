import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() data: AuthDto.LoginReq) {
    return this.authService.login(data);
  }
  @Post('signup')
  signup(@Body() data: AuthDto.SignupReq) {
    return this.authService.signup(data);
  }
}
