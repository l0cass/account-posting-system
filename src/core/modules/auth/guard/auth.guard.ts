import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';

import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request.headers);

    if (!accessToken) {
      throw new UnauthorizedException('Access token not obtained');
    }

    try {
      const payload = await this.jwtService.verify(accessToken);

      request['user'] = (await this.userService.findById(payload.sub)).data;
    } catch (error) {
      throw new UnauthorizedException('Badly registered access token');
    }

    return true;
  }

  private extractTokenFromHeader(headers: any): string | undefined {
    if (!headers?.authorization) return undefined;

    const [type, authorization] = headers.authorization.split(' ');
    return type === 'Bearer' ? authorization : undefined;
  }
}
