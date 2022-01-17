import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
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
    TagService,
    PrismaService,
    JwtStrategy
  ],
  controllers: [
    TagController
  ],
  exports: [TagService]
})
export class TagModule {}