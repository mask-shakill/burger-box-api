import { IsUUID, IsNumber, Min } from 'class-validator';

export class OrderItemDto {
  @IsUUID()
  product_id!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unit_price!: number;
}
