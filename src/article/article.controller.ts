import { Controller, Body, Get, Post, Put, Delete, Param, Query, UsePipes, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { User } from '../user/user.decorator';
import { ArticleData, CommentData } from './article.interface';
import { JwtAuthGuard } from '../common/auth/jwt-auth.guard';
import { IsAuthOptional } from '../common/auth/auth.decorator';
import { QueryListDTO, QueryFeedDTO, CreateArticleDTO, UpdateArticleDTO, AddCommentDTO } from './dto/article.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';

@Controller('articles')
export class ArticleController {

  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @IsAuthOptional()
  async listArticles(@User() user, @Query() query: QueryListDTO): Promise<ArticleData[]> {
    return await this.articleService.listArticles(user, query);
  }

  @Get('feed')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async feedArticles(@User() user, @Query() query: QueryFeedDTO): Promise<ArticleData[]> {
    return await this.articleService.feedArticles(user, query);
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string): Promise<ArticleData> {
    return await this.articleService.getArticle(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async createArticle(@User() user,
                          @Body('article') createArticleDTO: CreateArticleDTO): Promise<ArticleData> {
    return await this.articleService.createArticle(user, createArticleDTO);
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async updateArticle(@User() user, @Body('article') updateArticleDTO: UpdateArticleDTO,
                          @Param('slug') slug: string): Promise<ArticleData> {
    return await this.articleService.updateArticle(user, updateArticleDTO, slug);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  async deleteArticle(@User() user, @Param('slug') slug: string): Promise<ArticleData> {
    return await this.articleService.deleteArticle(user, slug);
  }

  @Post(':slug/comments')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async addCommentToArticle(@User() user, addCommentDTO: AddCommentDTO,
                          @Param('slug') slug: string): Promise<CommentData> {
    return await this.articleService.addCommentToArticle(user, addCommentDTO, slug);
  }

  @Get(':slug/comments')
  @UseGuards(JwtAuthGuard)
  @IsAuthOptional()
  async getCommentsFromArticle(@User() user, @Param('slug') slug: string): Promise<CommentData[]> {
    return await this.articleService.getCommentsFromArticle(user, slug);
  }

  @Delete(':slug/comments/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCommentFromArticle(@User() user, @Param('slug') slug: string, 
                          @Param('id') id: number): Promise<CommentData> {
    return await this.articleService.deleteCommentFromArticle(user, slug, id);
  }

  @Post(':slug/favorite')
  @UseGuards(JwtAuthGuard)
  async favoriteArticle(@User() user, @Param('slug') slug: string): Promise<ArticleData> {
    return await this.articleService.favoriteArticle(user, slug);
  }

  @Delete(':slug/favorite')
  @UseGuards(JwtAuthGuard)
  async unfavoriteArticle(@User() user, @Param('slug') slug: string): Promise<ArticleData> {
    return await this.articleService.favoriteArticle(user, slug, false);
  }


}