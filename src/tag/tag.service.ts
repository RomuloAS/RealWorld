import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { TagsData } from './tag.interface';
import { TagsSelect } from './tag.select';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async getTags(): Promise<TagsData> {
    const tags = await this.prisma.tag.findMany(TagsSelect);

    return tags.length
      ? { tags: tags.map((item) => item['tag']) }
      : { tags: [] };
  }
}
