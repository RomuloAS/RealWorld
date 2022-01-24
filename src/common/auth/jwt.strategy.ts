import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { jwtConstants } from './jwt.constants';
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
      const message = {
                    message: `User not found`,
                    errors: { body: [`User not present in the database`]}
                  };

      throw new HttpException(message, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return payload.user;
  }
}
