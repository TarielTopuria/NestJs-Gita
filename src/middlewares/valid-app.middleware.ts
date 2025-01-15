import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidAppMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.headers['user-agent'];

    if (!userAgent) {
      throw new ForbiddenException('User-Agent header is missing. Access denied.');
    }

    const isDesktop = /Windows|Macintosh|Linux/i.test(userAgent);

    if (!isDesktop) {
      throw new ForbiddenException('Access is allowed only from desktop devices.');
    }

    next();
  }
}