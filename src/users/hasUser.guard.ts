import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class HasUserId implements CanActivate {
  constructor(private readonly usersService: UsersService) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const userId = request.headers['user_id'] ? Number(request.headers['user_id']) : null;

    if (!userId) {
      throw new HttpException('userId not provided', HttpStatus.BAD_REQUEST);
    }

    const user = this.usersService.getUserById(userId);
    
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    request.userId = userId;
    return true;
  }
}
