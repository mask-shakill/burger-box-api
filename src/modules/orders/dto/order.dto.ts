import {
  IsUUID,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class OrderDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  user_id!: string;

  @IsNumber()
  total_amount!: number;

  @IsEnum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
  order_status!: string;

  @IsEnum(['unpaid', 'paid', 'failed', 'refunded'])
  payment_status!: string;

  @IsString()
  order_number!: string;

  @IsDateString()
  created_at!: string;

  @IsDateString()
  updated_at!: string;
}
