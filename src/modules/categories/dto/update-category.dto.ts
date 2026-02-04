import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
