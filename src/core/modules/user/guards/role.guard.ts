import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from 'src/common/enums/role';
import { ROLE_KEY } from '../decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest()?.user;

    if (!user) return false;

    const getRequiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLE_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!getRequiredRoles) return false;

    return getRequiredRoles.some((role) => role === user.role);
  }
}
