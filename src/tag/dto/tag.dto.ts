import { IsString, IsNotEmpty } from 'class-validator';

export class TagDTO {

  @IsNotEmpty()
  @IsString()
  readonly tag: string;

}