import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SupabaseService } from 'src/database/supabase.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, SupabaseService],
})
export class UsersModule {}
