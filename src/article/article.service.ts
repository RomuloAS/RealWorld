import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  QueryListDTO,
  QueryFeedDTO,
  CreateArticleDTO,
  UpdateArticleDTO,
  AddCommentDTO,
} from './dto/article.dto';
import {
  ArticleData,
  ArticlesData,
  CommentData,
  CommentsData,
} from './article.interface';
import { UserSelect as AuthorSelect } from '../user/user.select';
import { ArticleSelect, CommentSelect } from './article.select';
import { FollowedBySelect } from '../common/select/common.select';
const slugify = require('slugify');

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async listArticles(user, query: QueryListDTO): Promise<ArticlesData> {
    const { tag, author, favorited, limit, offset } = query;
    const where = {};

    if (tag) {
      where['tags'] = { some: { tag: tag } };
    }
    if (author) {
      where['author'] = { username: author };
    }
    if (favorited) {
      where['favoritedBy'] = { some: { username: favorited } };
    }

    const authorSelect = FollowedBySelect(user);

    ArticleSelect['favoritedBy'] = { select: authorSelect };
    ArticleSelect['author'] = { select: authorSelect };

    const articles = await this.prisma.article.findMany({
      where: where,
      select: ArticleSelect,
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      articles: articles.map(
        (article) => this.createArticleData(article)['article'],
      ),
    };
  }

  async feedArticles(user, query: QueryFeedDTO): Promise<ArticlesData> {
    const { limit, offset } = query;

    const authorSelect = FollowedBySelect(user);

    ArticleSelect['favoritedBy'] = { select: authorSelect };
    ArticleSelect['author'] = { select: authorSelect };

    const articles = await this.prisma.article.findMany({
      where: { author: { username: user.username } },
      select: ArticleSelect,
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      articles: articles.map(
        (article) => this.createArticleData(article)['article'],
      ),
    };
  }

  async getArticle(slug: string): Promise<ArticleData> {
    const article = await this.prisma.article.findUnique({
      where: {
        slug: slug,
      },
      select: ArticleSelect,
    });

    if (!article) {
      throw new HttpException(
        {
          message: 'Article Not Found',
          errors: { article: 'Slug does not represent any Article' },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.createArticleData(article);
  }

  async createArticle(
    user,
    createArticleDTO: CreateArticleDTO,
  ): Promise<ArticleData> {
    const tagsFormat = (item) => {
      const tag = item.toString();
      return { where: { tag: tag }, create: { tag: tag } };
    };

    const { title, description, body, tagList } = createArticleDTO;
    const { username } = user;
    const tags = tagList ? tagList.map((item) => tagsFormat(item)) : [];

    await this.titleUniqueness(title, username);

    const slugCount = await this.prisma.article.count({
      where: {
        title: title,
      },
    });

    const slug = `${slugify(title)}-${slugCount + 1}`;

    const data = {
      title: title,
      description: description,
      body: body,
      slug: slug,
      tags: { connectOrCreate: tags },
      author: { connect: { username: username } },
    };

    const authorSelect = FollowedBySelect(user);

    ArticleSelect['favoritedBy'] = { select: authorSelect };
    ArticleSelect['author'] = { select: authorSelect };

    const article = await this.prisma.article.create({
      data: data,
      select: ArticleSelect,
    });

    return this.createArticleData(article);
  }

  async updateArticle(
    user,
    updateArticleDTO: UpdateArticleDTO,
    slug: string,
  ): Promise<ArticleData> {
    const { title, description, body } = updateArticleDTO;
    const { username } = user;

    await this.userCreatedArticle(await this.getArticle(slug), username);
    await this.titleUniqueness(title, username);

    const slugCount = await this.prisma.article.count({
      where: {
        title: title,
      },
    });

    const newSlug = `${slugify(title)}-${slugCount + 1}`;

    const data = {
      title: title,
      description: description,
      body: body,
      slug: newSlug,
    };

    const authorSelect = FollowedBySelect(user);

    ArticleSelect['favoritedBy'] = { select: authorSelect };
    ArticleSelect['author'] = { select: authorSelect };

    const article = await this.prisma.article.update({
      where: {
        slug: slug,
      },
      data: data,
      select: ArticleSelect,
    });

    return this.createArticleData(article);
  }

  async deleteArticle(user, slug: string): Promise<ArticleData> {
    const { username } = user;

    await this.userCreatedArticle(await this.getArticle(slug), username);

    const authorSelect = FollowedBySelect(user);

    ArticleSelect['favoritedBy'] = { select: authorSelect };
    ArticleSelect['author'] = { select: authorSelect };

    const article = await this.prisma.article.delete({
      where: {
        slug: slug,
      },
      select: ArticleSelect,
    });

    return this.createArticleData(article);
  }

  async getComment(id: number): Promise<CommentData> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: id,
      },
      select: CommentSelect,
    });

    if (!comment) {
      throw new HttpException(
        {
          message: 'Deletion of a Comment failed',
          errors: { article: 'Id does not represent any Comment' },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.createCommentData(comment);
  }

  async addCommentToArticle(
    user,
    addCommentDTO: AddCommentDTO,
    slug: string,
  ): Promise<CommentData> {
    const { username } = user;
    const { body } = addCommentDTO;

    await this.getArticle(slug);

    const data = {
      body: body,
      author: { connect: { username: username } },
      article: { connect: { slug: slug } },
    };

    const authorSelect = FollowedBySelect(user);

    CommentSelect['author'] = { select: authorSelect };

    const comment = await this.prisma.comment.create({
      data: data,
      select: CommentSelect,
    });

    return this.createCommentData(comment);
  }

  async getCommentsFromArticle(user, slug: string): Promise<CommentsData> {
    await this.getArticle(slug);

    const authorSelect = FollowedBySelect(user);

    CommentSelect['author'] = { select: authorSelect };

    const comments = await this.prisma.comment.findMany({
      where: {
        article: {
          slug: slug,
        },
      },
      select: CommentSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      comments: comments.map(
        (comment) => this.createCommentData(comment)['comment'],
      ),
    };
  }

  async deleteCommentFromArticle(
    user,
    slug: string,
    id: number,
  ): Promise<CommentData> {
    const { username } = user;

    await this.getArticle(slug);
    await this.userCreatedComment(await this.getComment(id), username);

    const authorSelect = FollowedBySelect(user);

    CommentSelect['author'] = { select: authorSelect };

    const comment = await this.prisma.comment.delete({
      where: {
        id: id,
      },
      select: CommentSelect,
    });

    return this.createCommentData(comment);
  }

  async favoriteArticle(
    user,
    slug: string,
    favorite: boolean = true,
  ): Promise<ArticleData> {
    const { username } = user;

    await this.getArticle(slug);

    const authorSelect = FollowedBySelect(user);

    ArticleSelect['favoritedBy'] = { select: authorSelect };
    ArticleSelect['author'] = { select: authorSelect };

    const data = { favoritedBy: {} };
    if (favorite) {
      data.favoritedBy = { connect: { username: username } };
    } else {
      data.favoritedBy = { disconnect: { username: username } };
    }

    const article = await this.prisma.article.update({
      where: { slug: slug },
      data: data,
      select: ArticleSelect,
    });

    return this.createArticleData(article);
  }

  private createArticleData(article): ArticleData {
    const {
      slug,
      title,
      description,
      body,
      tags,
      createdAt,
      updatedAt,
      favoritedBy,
      _count,
      author,
    } = article;
    const { username, followedBy, profile } = author;
    const { bio, image } = profile;

    const tagList = tags.length ? tags.map((item) => item['tag']) : [];
    const following = followedBy && followedBy.length ? true : false;
    const favorited = favoritedBy && favoritedBy.length ? true : false;
    const favoritesCount = _count.favoritedBy;

    const articleProfile = {
      article: {
        slug: slug,
        title: title,
        description: description,
        body: body,
        tagList: tagList,
        createdAt: createdAt,
        updatedAt: updatedAt,
        favorited: favorited,
        favoritesCount: favoritesCount,
        author: {
          username: username,
          bio: bio,
          image: image,
          following: following,
        },
      },
    };

    return articleProfile;
  }

  private createCommentData(comment): CommentData {
    const { id, body, createdAt, updatedAt, author } = comment;
    const { username, followedBy, profile } = author;
    const { bio, image } = profile;
    const following = followedBy && followedBy.length ? true : false;

    const commentProfile = {
      comment: {
        id: id,
        createdAt: createdAt,
        updatedAt: updatedAt,
        body: body,
        author: {
          username: username,
          bio: bio,
          image: image,
          following: following,
        },
      },
    };

    return commentProfile;
  }

  private userCreatedArticle(articleE, username: string) {
    const { article } = articleE;

    if (article.author.username !== username) {
      throw new HttpException(
        {
          message: 'Article operation failed',
          errors: { article: 'Article does not belong to the current User' },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async titleUniqueness(title: string, username: string): Promise<void> {
    const notUnique = await this.prisma.article.findFirst({
      where: {
        title: title,
        author: {
          username: username,
        },
      },
      select: {
        title: true,
        author: {
          select: { username: true },
        },
      },
    });

    if (notUnique) {
      throw new HttpException(
        {
          message: 'Creation/Update of an article failed',
          errors: { article: 'Title must be unique' },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  private userCreatedComment(commentE, username: string) {
    const { comment } = commentE;

    if (comment.author.username !== username) {
      throw new HttpException(
        {
          message: 'Comment operation failed',
          errors: { article: 'Comment does not belong to the current User' },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
