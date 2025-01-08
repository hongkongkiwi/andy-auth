-- Prisma Database Comments Generator v1.0.2

-- resource_members comments
COMMENT ON TABLE "resource_members" IS 'Links users to resources with role-based access control (RBAC) but also supports additional gradular permissions';
COMMENT ON COLUMN "resource_members"."role" IS 'The member''s base role for this resource';
COMMENT ON COLUMN "resource_members"."permissions" IS 'Additional granular permissions';

-- object_storage_files comments
COMMENT ON TABLE "object_storage_files" IS 'File stored in object storage (S3, Azure, GCP)';

-- incident comments
COMMENT ON TABLE "incident" IS 'Security incident record';
COMMENT ON COLUMN "incident"."title" IS 'Incident title/summary';
COMMENT ON COLUMN "incident"."description" IS 'Detailed incident description';
COMMENT ON COLUMN "incident"."status" IS 'Current incident status';
COMMENT ON COLUMN "incident"."occurred_at" IS 'When the incident occurred';
COMMENT ON COLUMN "incident"."address" IS 'Address where incident occurred';
COMMENT ON COLUMN "incident"."severity" IS 'Incident severity';
COMMENT ON COLUMN "incident"."category" IS 'Incident category';
COMMENT ON COLUMN "incident"."response_time" IS 'Time to first response in minutes';
COMMENT ON COLUMN "incident"."resolution_time" IS 'Time to resolution in minutes';
COMMENT ON COLUMN "incident"."assigned_at" IS 'When the incident was assigned';
COMMENT ON COLUMN "incident"."priority" IS 'Priority level (1-5)';
COMMENT ON COLUMN "incident"."due_date" IS 'Due date for resolution';
COMMENT ON COLUMN "incident"."tags" IS 'Tags for categorization';

-- client comments
COMMENT ON TABLE "client" IS 'Client organization within a workspace';
COMMENT ON COLUMN "client"."name" IS 'Display name of the client';
COMMENT ON COLUMN "client"."description" IS 'Optional client description';
COMMENT ON COLUMN "client"."logo_url" IS 'URL to client logo image';
COMMENT ON COLUMN "client"."status" IS 'Current client status';
COMMENT ON COLUMN "client"."settings" IS 'Client configuration settings';
COMMENT ON COLUMN "client"."address" IS 'Physical address information';
COMMENT ON COLUMN "client"."max_patrols" IS 'Maximum number of patrols allowed';

-- workspace comments
COMMENT ON COLUMN "workspace"."name" IS 'Display name of the workspace';
COMMENT ON COLUMN "workspace"."slug" IS 'URL-friendly unique identifier';
COMMENT ON COLUMN "workspace"."logo_url" IS 'URL to workspace logo image';
COMMENT ON COLUMN "workspace"."description" IS 'Optional workspace description';
COMMENT ON COLUMN "workspace"."status" IS 'Current workspace status';
COMMENT ON COLUMN "workspace"."settings" IS 'Workspace configuration settings';
COMMENT ON COLUMN "workspace"."address" IS 'Physical address information';
COMMENT ON COLUMN "workspace"."features" IS 'Workspace features';

-- patrols comments
COMMENT ON TABLE "patrols" IS 'Physical patrol for a client';
COMMENT ON COLUMN "patrols"."name" IS 'Display name of the patrol';
COMMENT ON COLUMN "patrols"."description" IS 'Optional patrol description';
COMMENT ON COLUMN "patrols"."status" IS 'Current patrol status';
COMMENT ON COLUMN "patrols"."address" IS 'Physical address information';
COMMENT ON COLUMN "patrols"."patrol_settings" IS 'Patrol configuration settings';

-- users comments
COMMENT ON TABLE "users" IS 'Core user model with authentication, profile, and relationship data';
COMMENT ON COLUMN "users"."email" IS 'Primary email address for account access and notifications';
COMMENT ON COLUMN "users"."emailVerified" IS 'When email verification was completed';
COMMENT ON COLUMN "users"."phoneNumber" IS 'Contact phone number for account recovery and 2FA';
COMMENT ON COLUMN "users"."phoneVerified" IS 'When phone verification was completed';
COMMENT ON COLUMN "users"."mfaEnabled" IS 'MFA status flag';
COMMENT ON COLUMN "users"."lastLoginAt" IS 'Last successful authentication timestamp';
COMMENT ON COLUMN "users"."status" IS 'Account status';
COMMENT ON COLUMN "users"."isPlatformAdmin" IS 'Platform administrator access flag';
COMMENT ON COLUMN "users"."name" IS 'Display name for the user';

-- AuthSession comments
COMMENT ON TABLE "AuthSession" IS 'Tracks authenticated user sessions across devices';
COMMENT ON COLUMN "AuthSession"."token" IS 'Unique session identifier';
COMMENT ON COLUMN "AuthSession"."expires_at" IS 'Session expiration timestamp';
COMMENT ON COLUMN "AuthSession"."ip_address" IS 'Client IP address';
COMMENT ON COLUMN "AuthSession"."user_agent" IS 'Client browser/app identifier';
COMMENT ON COLUMN "AuthSession"."last_active_at" IS 'Last activity timestamp';
COMMENT ON COLUMN "AuthSession"."is_revoked" IS 'Manual session termination flag';
COMMENT ON COLUMN "AuthSession"."device_id" IS 'Unique device identifier';
COMMENT ON COLUMN "AuthSession"."device_name" IS 'User-provided device name';
COMMENT ON COLUMN "AuthSession"."session_type" IS 'Session type (web/mobile/api)';
COMMENT ON COLUMN "AuthSession"."geo_patrol" IS 'Patrol data for session';
COMMENT ON COLUMN "AuthSession"."mfa_verified" IS 'MFA completion status';
COMMENT ON COLUMN "AuthSession"."failed_attempts" IS 'Failed authentication count';
COMMENT ON COLUMN "AuthSession"."refresh_token" IS 'Session refresh token';

-- oauth_accounts comments
COMMENT ON TABLE "oauth_accounts" IS 'Tracks OAuth provider accounts linked to users';
COMMENT ON COLUMN "oauth_accounts"."provider" IS 'OAuth provider type (e.g., ''google'', ''github'')';
COMMENT ON COLUMN "oauth_accounts"."provider_account_id" IS 'Provider-specific account identifier';
COMMENT ON COLUMN "oauth_accounts"."access_token" IS 'OAuth access token';
COMMENT ON COLUMN "oauth_accounts"."refresh_token" IS 'OAuth refresh token';
COMMENT ON COLUMN "oauth_accounts"."expires_at" IS 'Access token expiration';
COMMENT ON COLUMN "oauth_accounts"."scope" IS 'OAuth scope permissions';
COMMENT ON COLUMN "oauth_accounts"."id_token" IS 'ID token for OpenID Connect';
COMMENT ON COLUMN "oauth_accounts"."token_type" IS 'Token type (e.g., ''bearer'')';
COMMENT ON COLUMN "oauth_accounts"."session_state" IS 'Session state';

-- seed_executions comments
COMMENT ON TABLE "seed_executions" IS 'Tracks database seed executions for development and testing';

-- audit_logs comments
COMMENT ON TABLE "audit_logs" IS 'Audit log for security events';

-- verification_tokens comments
COMMENT ON TABLE "verification_tokens" IS 'Verification token for email/phone verification';
