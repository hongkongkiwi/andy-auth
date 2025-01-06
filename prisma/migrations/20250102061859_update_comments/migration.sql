-- Prisma Database Comments Generator v1.0.2

-- platform_user comments
COMMENT ON COLUMN "platform_user"."email_address" IS 'User''s email address';
COMMENT ON COLUMN "platform_user"."email_address_verified_at" IS 'When email was verified';
COMMENT ON COLUMN "platform_user"."phone_number" IS 'User''s phone number';
COMMENT ON COLUMN "platform_user"."phone_number_verified_at" IS 'When phone was verified';
COMMENT ON COLUMN "platform_user"."password_hash" IS 'Hashed password';
COMMENT ON COLUMN "platform_user"."password_salt" IS 'Password salt';
COMMENT ON COLUMN "platform_user"."mfa_enabled" IS 'Whether MFA is enabled';
COMMENT ON COLUMN "platform_user"."authentication_methods" IS 'Allowed authentication methods';
COMMENT ON COLUMN "platform_user"."last_login_at" IS 'Last successful login';
COMMENT ON COLUMN "platform_user"."login_attempts" IS 'Count of login attempts';
COMMENT ON COLUMN "platform_user"."last_login_attempt_at" IS 'Last login attempt timestamp';
COMMENT ON COLUMN "platform_user"."locked_at" IS 'When account was locked';
COMMENT ON COLUMN "platform_user"."locked_reason" IS 'Reason for account lock';
COMMENT ON COLUMN "platform_user"."password_last_changed" IS 'Password last changed';
COMMENT ON COLUMN "platform_user"."require_password_change" IS 'Require password change';
COMMENT ON COLUMN "platform_user"."failed_login_attempts" IS 'Failed login attempts';
COMMENT ON COLUMN "platform_user"."last_failed_login_at" IS 'Last failed login attempt';
COMMENT ON COLUMN "platform_user"."lockout_until" IS 'Lockout until';

-- auth_session comments
COMMENT ON COLUMN "auth_session"."is_revoked" IS 'Whether the session has been revoked';
COMMENT ON COLUMN "auth_session"."revoked_at" IS 'When the session was revoked';
COMMENT ON COLUMN "auth_session"."expires_at" IS 'When the session expires';
COMMENT ON COLUMN "auth_session"."last_active_at" IS 'Last activity timestamp';
COMMENT ON COLUMN "auth_session"."ip_address" IS 'IP address of the client';
COMMENT ON COLUMN "auth_session"."user_agent" IS 'User agent of the client';
COMMENT ON COLUMN "auth_session"."device_id" IS 'Device ID';
COMMENT ON COLUMN "auth_session"."device_name" IS 'Device name';
COMMENT ON COLUMN "auth_session"."refresh_token" IS 'Session refresh token';

-- platform_user_verification_token comments
COMMENT ON COLUMN "platform_user_verification_token"."last_modified_by" IS 'Who last modified the record';
COMMENT ON COLUMN "platform_user_verification_token"."deleted_at" IS 'Soft delete timestamp';
COMMENT ON COLUMN "platform_user_verification_token"."deleted_by" IS 'Who deleted the record';

-- platform_user_login_attempt comments
COMMENT ON COLUMN "platform_user_login_attempt"."is_login_failed" IS 'Whether the login failed';
COMMENT ON COLUMN "platform_user_login_attempt"."failure_reason" IS 'Reason for failure if applicable';
COMMENT ON COLUMN "platform_user_login_attempt"."ip_address" IS 'IP address of the attempt';
COMMENT ON COLUMN "platform_user_login_attempt"."user_agent" IS 'User agent of the attempt';
COMMENT ON COLUMN "platform_user_login_attempt"."auth_method" IS 'Authentication method used';

-- security_event comments
COMMENT ON COLUMN "security_event"."ip_address" IS 'IP address of the event';
COMMENT ON COLUMN "security_event"."user_agent" IS 'User agent of the event';

-- person_profile comments
COMMENT ON COLUMN "person_profile"."first_name" IS 'User''s first name';
COMMENT ON COLUMN "person_profile"."last_name" IS 'User''s last name';

-- incident comments
COMMENT ON COLUMN "incident"."occurred_at" IS 'When the incident occurred';
COMMENT ON COLUMN "incident"."response_time" IS 'Time to first response in minutes';
COMMENT ON COLUMN "incident"."resolution_time" IS 'Time to resolution in minutes';
COMMENT ON COLUMN "incident"."assigned_at" IS 'When the incident was assigned';
COMMENT ON COLUMN "incident"."due_date" IS 'Due date for resolution';

-- workspace comments
COMMENT ON TABLE "workspace" IS 'Customer organization workspace';
COMMENT ON COLUMN "workspace"."name" IS 'Display name of the workspace';
COMMENT ON COLUMN "workspace"."slug" IS 'URL-friendly unique identifier';
COMMENT ON COLUMN "workspace"."logo_url" IS 'URL to workspace logo image';
COMMENT ON COLUMN "workspace"."description" IS 'Optional workspace description';
COMMENT ON COLUMN "workspace"."status" IS 'Current workspace status';
COMMENT ON COLUMN "workspace"."settings" IS 'Workspace configuration settings';
COMMENT ON COLUMN "workspace"."address" IS 'Physical address information';
COMMENT ON COLUMN "workspace"."max_clients" IS 'Maximum number of clients allowed';
COMMENT ON COLUMN "workspace"."max_locations_per_client" IS 'Maximum number of locations per client';
COMMENT ON COLUMN "workspace"."features" IS 'Workspace features';

-- workspace_permission comments
COMMENT ON TABLE "workspace_permission" IS 'Workspace permission assignment';
COMMENT ON COLUMN "workspace_permission"."type" IS 'Permission level';

-- client comments
COMMENT ON TABLE "client" IS 'Client organization within a workspace';
COMMENT ON COLUMN "client"."name" IS 'Display name of the client';
COMMENT ON COLUMN "client"."description" IS 'Optional client description';
COMMENT ON COLUMN "client"."logo_url" IS 'URL to client logo image';
COMMENT ON COLUMN "client"."status" IS 'Current client status';
COMMENT ON COLUMN "client"."settings" IS 'Client configuration settings';
COMMENT ON COLUMN "client"."address" IS 'Physical address information';
COMMENT ON COLUMN "client"."max_locations" IS 'Maximum number of locations allowed';

-- client_permission comments
COMMENT ON TABLE "client_permission" IS 'Client permission assignment';
COMMENT ON COLUMN "client_permission"."type" IS 'Permission level';

-- location comments
COMMENT ON TABLE "location" IS 'Physical location for a client';
COMMENT ON COLUMN "location"."name" IS 'Display name of the location';
COMMENT ON COLUMN "location"."description" IS 'Optional location description';
COMMENT ON COLUMN "location"."status" IS 'Current location status';
COMMENT ON COLUMN "location"."address" IS 'Physical address information';
COMMENT ON COLUMN "location"."location_settings" IS 'Location configuration settings';

-- location_permission comments
COMMENT ON TABLE "location_permission" IS 'Location permission assignment';
COMMENT ON COLUMN "location_permission"."type" IS 'Permission level';
