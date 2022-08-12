import { IsNotEmpty, IsNumber, IsOptional,IsString } from 'class-validator';

export class CategoryUpdateDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}

export default CategoryUpdateDto;