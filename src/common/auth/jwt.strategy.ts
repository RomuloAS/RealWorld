import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.jwtSecret,
    });
  }

  async validate(payload: any) {
    const UserExists = await this.prisma.user.findFirst({
      where: {
        username: payload.user.username,
        email: payload.user.email,
      },
      select: { username: true },
    });

    if (!UserExists) {
      return false;
    }

    return payload.user;
  }
}
