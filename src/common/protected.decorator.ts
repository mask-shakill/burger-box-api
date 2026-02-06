import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

export const Protected = () => UseGuards(JwtAuthGuard);
