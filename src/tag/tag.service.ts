import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { TagsData } from './tag.interface';

const TagsSelect = {
  select: {
    tag: true
  }
};

@Injectable()
export class TagService {

  constructor(private prisma: PrismaService){}

  async getTags(): Promise<TagsData> {

    const tags = await this.prisma.tag.findMany(
      TagsSelect
      );

    return tags.length ? {tags: tags.map(item => item['tag'])} : {tags: []};
  }

}