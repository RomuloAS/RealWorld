import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [
    TagService
  ],
  controllers: [
    TagController
  ]
})
export class TagModule {}