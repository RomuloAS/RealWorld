import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
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
    ArticleService,
    PrismaService,
    JwtStrategy
  ],
  controllers: [
    ArticleController
  ],
  exports: [ArticleService]
})
export class ArticleModule {}
