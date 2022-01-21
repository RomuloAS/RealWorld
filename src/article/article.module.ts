import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  providers: [
    ArticleService,
    PrismaService
  ],
  controllers: [
    ArticleController
  ],
  exports: [ArticleService]
})
export class ArticleModule {}
