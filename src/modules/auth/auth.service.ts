import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private async validateUser(user: AuthDto.LoginReq): Promise<AuthDto.User> {
    const existingUser = await this.userRepository.getByEmail(user.email);
    if (!existingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const isPasswordValid = await bcrypt.compare(
      existingUser.password,
      hashedPassword,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { email: user.email, id: user.id };
  }

  async login(user: AuthDto.LoginReq): Promise<AuthDto.Res> {
    const validatedUser = await this.validateUser(user);
    return {
      currentUser: validatedUser,
      accessToken: this.jwtService.sign(validatedUser),
      refreshToken: this.jwtService.sign(validatedUser),
    };
  }

  async signup(user: AuthDto.SignupReq): Promise<AuthDto.Res> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    // const newUser=await this.userRepository.create();
    return {
      currentUser: { email: user.email, id: 1 },
      accessToken: this.jwtService.sign({ email: user.email, id: 1 }),
      refreshToken: this.jwtService.sign({ email: user.email, id: 1 }),
    };
  }
}
