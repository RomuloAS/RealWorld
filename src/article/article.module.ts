import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [
    ArticleService
  ],
  controllers: [
    ArticleController
  ]
})
export class ArticleModule {}
