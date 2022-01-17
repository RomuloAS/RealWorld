import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [UserModule,
            ProfileModule,
            ArticleModule,
            TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
