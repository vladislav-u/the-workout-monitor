import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/types/express-request.interface';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user || !request.user?.userId) {
      throw new UnauthorizedException('User ID is missing from request');
    }

    return request.user.userId;
  },
);
