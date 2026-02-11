import { SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

export const ROLE_KEY = 'role';
export const Protected = (role?: string) => {
  return (target: any, key?: any, descriptor?: any) => {
    const value = role ?? '';
    SetMetadata(ROLE_KEY, value)(target, key, descriptor);
    UseGuards(JwtAuthGuard)(target, key, descriptor);
  };
};
