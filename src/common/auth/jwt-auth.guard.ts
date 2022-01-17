import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_AUTH_OPTIONAL } from './auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context, status) {

    const isAuthOptional = this.reflector.getAllAndOverride<boolean>(IS_AUTH_OPTIONAL, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isAuthOptional) {
      return user;
    }

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    
    return user;
  }

}
