import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET_KEY } from 'src/environment/config.env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "BLUESS",
    });
  }

  async validate(payload: any) {
    return {
        userId: payload.userId,
        walletId: payload.walletId,
        name: payload.name,
        address: payload.address,
    };
  }
}