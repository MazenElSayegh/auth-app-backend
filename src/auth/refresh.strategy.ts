import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'RefreshStrategy',
) {
  constructor(private readonly appConfig: AppConfig) {
    super({
      algorithms: ['HS512'],
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.Config.Auth.Jwt.Key ?? '',
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: any) {
    return payload;
  }
}
