import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_METADATA_KEY, AppRole } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<AppRole[]>(
      ROLES_METADATA_KEY,
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const userRole = request.user?.role as AppRole;

    if (!userRole) throw new ForbiddenException('No role assigned');

    const roleHierarchy: AppRole[] = [
      'SUPER_ADMIN',
      'APP_ADMIN',
      'SUPPORT_AGENT',
      'BILLING_AUDITOR',
      'END_USER',
    ];

    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const hasPermission = requiredRoles.some(
      (role) => userRoleIndex <= roleHierarchy.indexOf(role),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Role ${userRole} does not have access. Required: ${requiredRoles.join(' | ')}`,
      );
    }

    return true;
  }
}
