import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  providers: [
    TagService,
    PrismaService
  ],
  controllers: [
    TagController
  ],
  exports: [TagService]
})
export class TagModule {}