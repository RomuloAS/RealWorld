import { TagsSelect } from '../tag/tag.select';
import { UserSelect as AuthorSelect } from '../user/user.select';

export const ArticleSelect = {
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

export const CommentSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  body: true,
  author: AuthorSelect
};