import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/database/supabase.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createOrder(dto: CreateOrderDto) {
    const client = this.supabaseService.client;
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10)}-${Math.floor(Math.random() * 10000)}`;
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0,
    );

    const { data: orderData, error: orderError } = await client
      .from('orders')
      .insert([
        {
          user_id: dto.user_id,
          order_number: orderNumber,
          total_amount: totalAmount,
          order_status: 'pending',
          payment_status: 'unpaid',
        },
      ])
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    const orderItemsToInsert = dto.items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const { error: itemsError } = await client
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) throw new Error(itemsError.message);

    return { order: orderData, items: orderItemsToInsert };
  }

  async getOrders() {
    const client = this.supabaseService.client;
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async getOrderById(id: string) {
    const client = this.supabaseService.client;

    const { data: order, error: orderError } = await client
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) throw new Error(orderError.message);

    const { data: items, error: itemsError } = await client
      .from('order_items')
      .select('*')
      .eq('order_id', id);

    if (itemsError) throw new Error(itemsError.message);

    return { order, items };
  }

  async updateOrder(id: string, dto: UpdateOrderDto) {
    const client = this.supabaseService.client;

    const { data, error } = await client
      .from('orders')
      .update(dto)
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  async deleteOrder(id: string) {
    const client = this.supabaseService.client;
    const { error: itemsError } = await client
      .from('order_items')
      .delete()
      .eq('order_id', id);
    if (itemsError) throw new Error(itemsError.message);

    const { error: orderError } = await client
      .from('orders')
      .delete()
      .eq('id', id);
    if (orderError) throw new Error(orderError.message);

    return { message: 'Order deleted successfully' };
  }
}
