import { IsNotEmpty, IsString } from 'class-validator';

export class PostCreateDto {
  @IsString({ each: true })
  @IsNotEmpty()
  paragraphs: string[];

  content: string;
  title: string;
}
