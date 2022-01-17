import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { QueryListDTO, QueryFeedDTO, CreateArticleDTO, UpdateArticleDTO, AddCommentDTO } from './dto/article.dto';
import { ArticleData, CommentData } from './article.interface';

@Injectable()
export class ArticleService {

  constructor(private prisma: PrismaService){}

  async listArticles(user, query: QueryListDTO): Promise<ArticleData[]> {
    return null;
  }

  async feedArticles(user, query: QueryFeedDTO): Promise<ArticleData[]> {
    return null;
  }

  async getArticle(slug: string): Promise<ArticleData> {
    return null;
  }

  async createArticle(user, createArticleDTO: CreateArticleDTO): Promise<ArticleData> {
    return null;
  }

  async updateArticle(user, updateArticleDTO: UpdateArticleDTO, slug: string): Promise<ArticleData> {
    return null;
  }

  async deleteArticle(user, slug: string): Promise<ArticleData> {
    return null;
  }

  async addCommentToArticle(user, addCommentDTO: AddCommentDTO, slug: string): Promise<CommentData> {
    return null;
  }

  async getCommentsFromArticle(user, slug: string): Promise<CommentData[]> {
    return null;
  }

  async deleteCommentFromArticle(user, slug: string, id: number): Promise<CommentData> {
    return null;
  }

  async favoriteArticle(user, slug: string, favorite: boolean = true): Promise<ArticleData> {
    return null;
  }

}