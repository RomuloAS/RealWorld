export interface ArticleData {
  article: {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: Array<string>;
    createdAt: Date;
    updatedAt: Date;
    favorited: boolean;
    favoritesCount: number;
    author: {
      username: string;
      bio: string;
      image: string;
      following: boolean;
    };
  };
}

export interface ArticlesData {
  articles: ArticleData['article'][];
}

export interface CommentData {
  comment: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    body: string;
    author: {
      username: string;
      bio: string;
      image: string;
      following: boolean;
    };
  };
}

export interface CommentsData {
  comments: CommentData['comment'][];
}
