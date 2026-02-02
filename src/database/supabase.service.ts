import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.getOrThrow('SUPABASE_URL');
    const key = this.configService.getOrThrow('SUPABASE_ANON_KEY');

    this.supabase = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}
