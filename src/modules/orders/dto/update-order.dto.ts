import {
  IsUUID,
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
} from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
  order_status?: string;

  @IsOptional()
  @IsEnum(['unpaid', 'paid', 'failed', 'refunded'])
  payment_status?: string;

  @IsOptional()
  @IsString()
  order_number?: string;
}
