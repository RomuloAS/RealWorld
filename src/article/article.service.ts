import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { QueryListDTO, QueryFeedDTO, CreateArticleDTO, UpdateArticleDTO, AddCommentDTO } from './dto/article.dto';
import { ArticleData, CommentData } from './article.interface';
const slugify = require('slugify');

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

    const { title, description, body, tagList } = createArticleDTO;
    const { username } = user;
    const slug = slugify(title);
    const tags = tagList.map( item => {
      const tag = item.toString();
      return { where: {tag: tag}, create: {tag: tag} };
    })

    const notUnique = await this.prisma.article.findFirst({
      where: {title: title}
    });

    if (notUnique) {
      throw new HttpException({
        message: 'Creation of a new article failed',
        errors: {article: 'Article must be unique'}},
        HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const data = {title: title,
                  description: description,
                  body: body,
                  slug: slug,
                  tags: {connectOrCreate: tags},
                  author: {connect: {username: username}}
                };

    const article = await this.prisma.article.create({
      data: data
    });

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