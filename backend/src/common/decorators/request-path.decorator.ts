import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const RequestPath = createParamDecorator(
  (_: boolean, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.path;
  },
);
