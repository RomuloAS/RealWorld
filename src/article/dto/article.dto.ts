import { IsString, IsOptional, IsInt, Min, MinLength, IsNotEmpty, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { TagDTO } from '../../tag/dto/tag.dto'

export class QueryListDTO {

  @IsOptional()
  @IsString()
  readonly tag: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  readonly author: string;

  @IsOptional()
  @IsString()
  readonly favorited: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  readonly limit: number = 20;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  readonly offset: number = 0;

}

export class QueryFeedDTO {

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  readonly limit: number = 20;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  readonly offset: number = 0;

}

export class CreateArticleDTO {

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly body: string;

  @IsOptional()
  @IsArray()
  readonly tagList: TagDTO[];

}

export class UpdateArticleDTO {

  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly body: string;

}

export class AddCommentDTO {

  @IsNotEmpty()
  @IsString()
  readonly body: string;

}