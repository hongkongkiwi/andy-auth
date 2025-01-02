import type { AdapterUser } from '../types/adapter';
import {
  WorkspaceStatus,
  WorkspacePermissionType,
  PlatformUserStatus,
  NextAuthAccountType,
  Prisma,
  PlatformUser as BasePlatformUser
} from '@prisma/client';
import type { SessionUser } from '../types';
import { AuthMethod } from '../types/auth';
import { USER_SELECT, USER_WITH_PASSWORD_SELECT } from '../constants';

// Move type definition to top
export type WorkspacePermission = NonNullable<
  PlatformUser['workspacePermissions']
>[number];

// Define the extended PlatformUser type
type PlatformUser = Prisma.PlatformUserGetPayload<{
  select: {
    id: true;
    emailAddress: true;
    emailAddressVerifiedAt: true;
    phoneNumber: true;
    phoneNumberVerifiedAt: true;
    userStatus: true;
    languageLocale: true;
    timezone: true;
    personProfile: {
      select: {
        firstName: true;
        lastName: true;
        profileImage: true;
      };
    };
    workspacePermissions: {
      select: {
        workspace: {
          select: {
            id: true;
            displayName: true;
            imageUrl: true;
            workspaceStatus: true;
            slug: true;
            companyName: true;
            notes: true;
          };
        };
        permissions: true;
      };
    };
  };
}>;

// Base type for user with profile data
export type UserWithProfile = PlatformUser;

// Extended type for authentication that includes password
export type UserWithPassword = Prisma.PlatformUserGetPayload<{
  select: (typeof USER_WITH_PASSWORD_SELECT)['select'];
}>;

export const mapUserToSessionUser = (
  user: UserWithProfile | UserWithPassword
): SessionUser => ({
  id: user.id,
  name: user.personProfile?.firstName ?? null,
  email: user.emailAddress ?? '',
  image: user.personProfile?.profileImage ?? null,
  emailVerified: user.emailAddressVerifiedAt ?? null,
  phoneNumber: user.phoneNumber ?? null,
  phoneVerified: user.phoneNumberVerifiedAt ?? null,
  userStatus: user.userStatus,
  workspaces: user.workspacePermissions.map((wp: WorkspacePermission) => ({
    id: wp.workspace.id,
    displayName: wp.workspace.displayName,
    imageUrl: wp.workspace.imageUrl,
    status: wp.workspace.workspaceStatus as WorkspaceStatus,
    slug: wp.workspace.slug ?? '',
    companyName: wp.workspace.companyName ?? '',
    notes: wp.workspace.notes,
    permissions: wp.permissions as WorkspacePermissionType[]
  })),
  authMethod: AuthMethod.EMAIL,
  languageLocale: user.languageLocale ?? 'en',
  timezone: user.timezone ?? 'UTC',
  selectedWorkspaceId: null
});

export const mapUserToAuthUser = (user: PlatformUser): AdapterUser => ({
  id: user.id,
  name: user.personProfile
    ? `${user.personProfile.firstName} ${user.personProfile.lastName}`.trim()
    : null,
  email: user.emailAddress ?? '',
  emailVerified: user.emailAddressVerifiedAt,
  image: user.personProfile?.profileImage ?? null,
  phoneNumber: user.phoneNumber ?? null,
  phoneVerified: user.phoneNumberVerifiedAt,
  userStatus: user.userStatus ?? PlatformUserStatus.ACTIVE,
  workspaces:
    user.workspacePermissions?.map((wp: WorkspacePermission) => ({
      id: wp.workspace.id,
      displayName: wp.workspace.displayName,
      imageUrl: wp.workspace.imageUrl,
      status: wp.workspace.workspaceStatus,
      slug: wp.workspace.slug ?? '',
      companyName: wp.workspace.companyName ?? '',
      notes: wp.workspace.notes,
      permissions: wp.permissions
    })) ?? [],
  personProfile: user.personProfile
    ? {
        firstName: user.personProfile.firstName ?? null,
        lastName: user.personProfile.lastName ?? null,
        profileImage: user.personProfile.profileImage
      }
    : null,
  authMethod: AuthMethod.EMAIL,
  selectedWorkspaceId: null
});

export const mapAuthMethodToNextAuth = (
  method: AuthMethod
): NextAuthAccountType => {
  switch (method) {
    case AuthMethod.EMAIL:
      return NextAuthAccountType.EMAIL;
    case AuthMethod.OAUTH:
      return NextAuthAccountType.OAUTH;
    case AuthMethod.OIDC:
      return NextAuthAccountType.OIDC;
    case AuthMethod.WEBAUTHN:
      return NextAuthAccountType.WEBAUTHN;
    default:
      return NextAuthAccountType.EMAIL;
  }
};
