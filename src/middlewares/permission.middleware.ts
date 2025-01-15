import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PermissionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const permission = req.headers['permission'];

    if (!permission) {
      throw new ForbiddenException('Permission header is required.');
    }

    const methodToOperationMap: { [key: string]: string } = {
      GET: 'read',
      POST: 'create',
      PUT: 'update',
      DELETE: 'delete',
    };

    const operation = methodToOperationMap[req.method];

    if (!operation) {
      throw new ForbiddenException('Unsupported HTTP method.');
    }

    if (permission !== operation) {
      throw new ForbiddenException(`Permission denied for ${operation} operation.`);
    }

    next();
  }
}