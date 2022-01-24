import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.jwtSecret,
      signOptions: { expiresIn: '2h' },
    }),
    PrismaModule
  ],
  providers: [
    JwtStrategy
  ],
  exports: [JwtStrategy, JwtModule]
})
export class AuthModule {}
