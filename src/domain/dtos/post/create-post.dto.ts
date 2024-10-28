import { IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Title must be a string' })
  @Length(3, 100, { message: 'Title must be between 3 and 100 characters' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  @Length(10, 255, { message: 'Content must be between 10 and 255 characters' })
  content?: string;
}
