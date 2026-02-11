import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from 'src/common/protected.decorator';
import { IS_PUBLIC_KEY } from 'src/common/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const roleRequiredMethod = this.reflector.get<string>(
      ROLE_KEY,
      context.getHandler(),
    );
    const roleRequiredClass = this.reflector.get<string>(
      ROLE_KEY,
      context.getClass(),
    );
    let roleRequired: string | undefined;

    if (roleRequiredMethod !== undefined) {
      roleRequired = roleRequiredMethod;
    } else if (roleRequiredClass) {
      roleRequired = roleRequiredClass;
    }

    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new ForbiddenException('No token provided');
    const token = authHeader.split(' ')[1];
    if (!token) throw new ForbiddenException('Invalid token');

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new ForbiddenException('Invalid or expired token');
    }

    request.user = payload;

    if (roleRequired && payload.role !== roleRequired) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
