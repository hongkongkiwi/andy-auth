import { z } from 'zod';
import { AuthError, AuthErrorCode } from '../errors';
import { AUTH_ERROR_STATUS_CODES } from '../errors/status-codes';

// Basic workspace permission schema
const WorkspacePermissionSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  imageUrl: z.string().nullable(),
  status: z.string(),
  slug: z.string(),
  companyName: z.string(),
  notes: z.string().nullable(),
  permissions: z.array(z.string())
});

export const SessionUserSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
  emailVerified: z.date().nullable(),
  phoneNumber: z.string().nullable(),
  phoneVerified: z.date().nullable(),
  userStatus: z.string(),
  languageLocale: z.string().default('en'),
  timezone: z.string().default('UTC'),
  workspaces: z.array(WorkspacePermissionSchema).default([]),
  selectedWorkspaceId: z.string().nullable().default(null),
  authMethod: z.string()
});

// Add error handling for schema validation
export const validateSession = (data: unknown) => {
  try {
    return SessionSchema.parse(data);
  } catch (error) {
    throw new AuthError(AuthErrorCode.INVALID_SESSION_DATA, {
      message: 'Invalid session data',
      statusCode: AUTH_ERROR_STATUS_CODES.INVALID_SESSION_DATA,
      error: error instanceof Error ? error.message : 'Validation error'
    });
  }
};
