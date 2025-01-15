import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    const startHour = 10;
    const endHour = 18;

    if (currentHour < startHour || currentHour >= endHour) {
      throw new ForbiddenException('Requests are only allowed between 10 AM and 8 PM.');
    }

    next();
  }
}