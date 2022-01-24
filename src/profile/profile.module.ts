import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [
    ProfileService
  ],
  controllers: [
    ProfileController
  ]
})
export class ProfileModule {}
