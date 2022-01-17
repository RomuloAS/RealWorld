import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../common/auth/constants';
import { JwtStrategy } from '../common/auth/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.jwtSecret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [
    UserService,
    PrismaService,
    JwtStrategy
  ],
  controllers: [
    UserController
  ],
  exports: [UserService]
})
export class UserModule {}
