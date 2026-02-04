import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from 'src/database/supabase.service';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async getAllUsers() {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('*');

    if (error) throw error;
    return data;
  }

  async getUserById(id: string) {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('User not found');
    }

    return data;
  }

  async updateUser(id: string, payload: Partial<any>) {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('User not found or update failed');
    }

    return data;
  }

  async deleteUser(id: string) {
    const { error } = await this.supabaseService.client
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new NotFoundException('User not found or delete failed');
    }

    return { message: 'User deleted successfully' };
  }
}
