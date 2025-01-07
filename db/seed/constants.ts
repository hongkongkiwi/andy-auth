export const FIXED_USER_EMAILS = {
  ADMIN: 'admin@example.com',
  WORKSPACE_ADMIN: 'workspace.admin@example.com',
  CLIENT_ADMIN: 'client.admin@example.com',
  PATROL_ADMIN: 'patrol.admin@example.com',
  VIEWER: 'viewer@example.com',
  PENDING: 'pending@example.com'
} as const;

export type FixedUserEmail =
  (typeof FIXED_USER_EMAILS)[keyof typeof FIXED_USER_EMAILS];

const FIXED_EMAIL_SET = new Set<FixedUserEmail>(
  Object.values(FIXED_USER_EMAILS)
);

export const isFixedUserEmail = (
  email: string | null
): email is FixedUserEmail =>
  !!email && FIXED_EMAIL_SET.has(email as FixedUserEmail);
