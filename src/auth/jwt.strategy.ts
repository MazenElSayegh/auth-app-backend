import { ForbiddenException, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly appConfig: AppConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.Config.Auth.Jwt.Key ?? '',
      passReqToCallback: true,
      algorithms: [],
    });
  }

  validate(req: Request) {
    console.log(this.appConfig.Config.Auth.Jwt.Key);
    return req.user;
  }
}
