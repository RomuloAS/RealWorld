import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  providers: [
    ProfileService,
    PrismaService
  ],
  controllers: [
    ProfileController
  ],
  exports: [ProfileService]
})
export class ProfileModule {}
