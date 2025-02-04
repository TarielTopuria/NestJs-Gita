import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class HasUserId implements CanActivate {
  constructor(private readonly usersService: UsersService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = request.headers['user_id'];
    if (!userId) {
      throw new HttpException('user_id not provided', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
    request.userId = user._id;

    return true;
  }
}
