import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
@Injectable()
export class AuthGuardTest implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAll<string[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ]);
    console.log(roles);
    // const req = context.switchToHttp().getRequest();
    const [req, res, next] = context.getArgs();

    throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
  }
}
