// update-product.dto.ts
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category_id?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  is_available?: boolean;

  @IsOptional()
  @IsString()
  image_url?: string;
}
