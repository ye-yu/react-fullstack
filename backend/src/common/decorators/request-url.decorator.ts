import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const RequestUrl = createParamDecorator(
  (noQuery: boolean, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (noQuery) {
      const splitted = request.originalUrl.split('?', 1).find((e) => e);
      return splitted ?? request.originalUrl;
    } else {
      return request.originalUrl;
    }
  },
);
