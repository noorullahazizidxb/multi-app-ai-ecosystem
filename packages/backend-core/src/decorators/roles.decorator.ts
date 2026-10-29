import { SetMetadata } from '@nestjs/common';

export const ROLES_METADATA_KEY = 'roles';

export type AppRole = 'SUPER_ADMIN' | 'APP_ADMIN' | 'SUPPORT_AGENT' | 'BILLING_AUDITOR' | 'END_USER';

/**
 * Decorator that restricts endpoint access to specific RBAC roles.
 * 
 * @example @Roles('SUPER_ADMIN', 'APP_ADMIN')
 */
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_METADATA_KEY, roles);
