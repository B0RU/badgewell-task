import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { jwtConstant } from './constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: jwtConstant.REFRESH_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    const me = await this.userService.findOneByEmail(payload.email);
    const returnedValues = {
      email: me.email,
      firstName: me.firstName,
      lastName: me.lastName,
      _id: me._id.toString(),
    };
    return returnedValues;
  }
}
