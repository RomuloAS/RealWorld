import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
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
    ProfileService,
    PrismaService,
    JwtStrategy
  ],
  controllers: [
    ProfileController
  ],
  exports: [ProfileService]
})
export class ProfileModule {}
