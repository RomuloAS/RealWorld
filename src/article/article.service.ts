import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { QueryListDTO, QueryFeedDTO, CreateArticleDTO, UpdateArticleDTO, AddCommentDTO } from './dto/article.dto';
import { ArticleData, ArticlesData, CommentData, CommentsData } from './article.interface';
const slugify = require('slugify');

const TagsSelect = {
  select: {
    tag: true
  }
};

const AuthorSelect = {
  select: {
    username: true,
    profile: {
      select: {bio: true, image: true},
    }
  }
};

const ArticleSelect = {
  slug: true,
  title: true,
  description: true,
  body: true,
  tags: TagsSelect,
  createdAt: true,
  updatedAt: true,
  favoritedBy: AuthorSelect,
  _count: {
        select: { favoritedBy: true },
  },
  author: AuthorSelect
};

@Injectable()
export class ArticleService {

  constructor(private prisma: PrismaService){}

  async listArticles(user, query: QueryListDTO): Promise<ArticlesData> {

    const { tag, author, favorited, limit, offset } = query;
    const where = {};

    if (tag) {
      where['tags'] = {some: {tag: tag}};
    };
    if (author) {
      where['author'] = {username: author};
    };
    if (favorited) {
      where['favoritedBy'] = {some: {username: favorited}}
    }

    const authorSelect = {...AuthorSelect['select'], 
      followedBy: {
        where: {
          username: user ? user.username : ''
        },
        select: {username: true}
      }
    }

    ArticleSelect['favoritedBy'] = {select: authorSelect}

    const articles = await this.prisma.article.findMany({
      where: where,
      select: ArticleSelect,
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {articles: articles.map(article => this.createArticleData(article)['article'])};
  }

  async feedArticles(user, query: QueryFeedDTO): Promise<ArticlesData> {

    const { limit, offset } = query;

    const authorSelect = {...AuthorSelect['select'], 
      followedBy: {
        where: {
          username: user ? user.username : ''
        },
        select: {username: true}
      }
    }

    ArticleSelect['favoritedBy'] = {select: authorSelect}

    const articles = await this.prisma.article.findMany({
      where: {author: {username: user.username}},
      select: ArticleSelect,
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {articles: articles.map(article => this.createArticleData(article)['article'])};
  }

  async getArticle(slug: string): Promise<ArticleData> {

    const article = await this.prisma.article.findUnique({
      where: {
        slug: slug
      },
      select: ArticleSelect
    });

    if (!article) {
      this.ArticleNotFound();
    }

    return this.createArticleData(article);
  }

  async createArticle(user, createArticleDTO: CreateArticleDTO): Promise<ArticleData> {

    const tagsFormat = (item) => {
      const tag = item.toString();
      return { where: {tag: tag}, create: {tag: tag} };
    }

    const { title, description, body, tagList } = createArticleDTO;
    const { username } = user;
    const tags = tagList ? tagList.map( item => tagsFormat(item)) : [];

    const notUnique = await this.prisma.article.findFirst({
      where: {
        title: title,
        author: {
          username: username
        }
      },
      select: {
        title: true,
        author: {
          select: {username: true}
        }
      }
    });

    if (notUnique) {
      throw new HttpException({
        message: 'Creation of a new article failed',
        errors: {article: 'Title must be unique'}},
        HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const slugCount = await this.prisma.article.count({
      where: {
        title: title
      }
    });

    const slug = `${slugify(title)}-${slugCount + 1}`;

    const data = {title: title,
                  description: description,
                  body: body,
                  slug: slug,
                  tags: {connectOrCreate: tags},
                  author: {connect: {username: username}}
                };

    const authorSelect = {...AuthorSelect['select'], 
      followedBy: {
        where: {
          username: user ? user.username : ''
        },
        select: {username: true}
      }
    }

    ArticleSelect['favoritedBy'] = {select: authorSelect}
    ArticleSelect['author'] = {select: authorSelect}


    const article = await this.prisma.article.create({
      data: data,
      select: ArticleSelect
    });

    return this.createArticleData(article);
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

  async getCommentsFromArticle(user, slug: string): Promise<CommentsData> {
    return null;
  }

  async deleteCommentFromArticle(user, slug: string, id: number): Promise<CommentData> {
    return null;
  }

  async favoriteArticle(user, slug: string, favorite: boolean = true): Promise<ArticleData> {
    return null;
  }

  private createArticleData(article): ArticleData {

    const { slug, title, description, body,
      tags, createdAt, updatedAt, favoritedBy,
      _count, author } = article;
    const { username, followedBy, profile } = author;
    const { bio, image } = profile;

    const tagList = tags.length ? tags.map(item => item['tag']) : [];
    const following = followedBy && followedBy.length ? true : false
    const favorited = favoritedBy && favoritedBy.length ? true : false
    const favoritesCount = _count.favoritedBy;

    const ArticleProfile = {
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
          following: following
        }
      }
    };

    return ArticleProfile;
  }

  private ArticleNotFound(){
    throw new HttpException({
        message: 'Article Not Found',
        errors: {article: 'Slug does not represent any Article'}},
        HttpStatus.NOT_FOUND);
  }

}