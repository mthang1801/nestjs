import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {} //reflect roles of user
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const authoriazationToken = req.headers?.authorization;
    if (!authoriazationToken) {
      throw new HttpException('Unauthorized access.', HttpStatus.UNAUTHORIZED);
    }
    const token = authoriazationToken.split(' ').slice(-1)[0];
    const decoded = jwt.verify(
      token,
      this.configService.get<string>('jwtSecretKey'),
    );

    const user = decoded?.sub;

    if (!user) {
      throw new HttpException('Token is invalid.', HttpStatus.UNAUTHORIZED);
    }

    if (+decoded['exp'] * 1000 - Date.now() < 0) {
      throw new HttpException('Token has been expired.', 408);
    }
    req.user = user;

    // const roles = this.reflector.getAllAndMerge<string[]>('roles', [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);

    // const roles = this.reflector.getAllAndOverride<string[]>('roles', [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    // console.log(roles);
    // if (!roles) {
    //   return true;
    // }

    return true;
  }
}
