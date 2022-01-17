import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagsData } from './tag.interface';

@Controller('tags')
export class TagController {

  constructor(private readonly tagService: TagService) {}

  @Get()
  async getTags(): Promise<TagsData> {
    return await this.tagService.getTags();
  }

}
