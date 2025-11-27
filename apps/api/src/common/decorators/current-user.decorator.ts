import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserPayload => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user as UserPayload;
  },
);
