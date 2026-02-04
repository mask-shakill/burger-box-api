import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from 'src/database/supabase.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createCategory(name: string, description?: string) {
    const supabase = this.supabaseService.client;
    const { data, error } = await supabase
      .from('categories')
      .insert([{ category_name: name, description }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getCategories() {
    const supabase = this.supabaseService.client;
    const { data, error } = await supabase.from('categories').select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async getCategoryById(id: string) {
    const supabase = this.supabaseService.client;
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return data;
  }

  async updateCategory(
    id: string,
    payload: Partial<{ category_name: string; description: string }>,
  ) {
    const supabase = this.supabaseService.client;
    const { data, error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException(`Failed to update category with id ${id}`);
    }

    return data;
  }

  async deleteCategory(id: string) {
    const supabase = this.supabaseService.client;
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      throw new NotFoundException(`Failed to delete category with id ${id}`);
    }

    return { message: `Category with id ${id} deleted successfully` };
  }
}
