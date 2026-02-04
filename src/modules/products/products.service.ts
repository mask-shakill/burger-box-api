import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from 'src/database/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) throw new BadRequestException('File is required');
    const bucket = 'product_images';
    const filePath = `products/${Date.now()}_${file.originalname}`;
    const { error: uploadError } = await this.supabaseService.client.storage
      .from(bucket)
      .upload(filePath, file.buffer, { contentType: file.mimetype });
    if (uploadError) throw new BadRequestException(uploadError.message);
    const { data } = this.supabaseService.client.storage
      .from(bucket)
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  async createProduct(dto: CreateProductDto) {
    const { data, error } = await this.supabaseService.client
      .from('products')
      .insert([dto])
      .select()
      .single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async getAllProducts() {
    const { data, error } = await this.supabaseService.client
      .from('products')
      .select('*');
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async getProductById(id: string) {
    const { data, error } = await this.supabaseService.client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) throw new NotFoundException('Product not found');
    return data;
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    const { data, error } = await this.supabaseService.client
      .from('products')
      .update(dto)
      .eq('id', id)
      .select();

    if (error) throw new BadRequestException(error.message);
    if (!data || data.length === 0)
      throw new NotFoundException('Product not found');
    return data[0];
  }

  async deleteProduct(id: string) {
    const { error } = await this.supabaseService.client
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw new NotFoundException('Product not found');
    return { message: 'Product deleted successfully' };
  }
}
