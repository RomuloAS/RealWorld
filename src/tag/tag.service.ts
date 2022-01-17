import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { TagsData } from './tag.interface';

@Injectable()
export class TagService {

  constructor(private prisma: PrismaService){}

  async getTags(): Promise<TagsData> {
    return null;
  }

}