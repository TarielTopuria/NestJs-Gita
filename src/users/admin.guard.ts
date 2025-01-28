import { BadRequestException, CanActivate, ExecutionContext, Header, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

export class IsAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request : Request = context.switchToHttp().getRequest();
    if(!request.headers['role']){
      throw new BadRequestException("Role is required");
    }
    if(!['admin'].includes(request.headers['role'] as string)){
      throw new UnauthorizedException("You don't have persmission");
    }
    return true;
  }

} 