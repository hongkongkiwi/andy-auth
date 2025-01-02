-- Prisma Database Comments Generator v1.0.2

-- guard_profiles comments
COMMENT ON TABLE "guard_profiles" IS 'Guard profile holds the guard information for security guards';
COMMENT ON COLUMN "guard_profiles"."guard_staff_id" IS 'Unique ID for guard staff';
COMMENT ON COLUMN "guard_profiles"."guard_pin_number" IS 'PIN number for on-device authentication';
COMMENT ON COLUMN "guard_profiles"."user_id" IS 'Associated user';

-- platform_users comments
COMMENT ON COLUMN "platform_users"."user_password" IS 'Hashed password for local authentication';
COMMENT ON COLUMN "platform_users"."last_login_at" IS 'Last successful login timestamp';
COMMENT ON COLUMN "platform_users"."failed_login_attempts" IS 'Failed login attempts count';
COMMENT ON COLUMN "platform_users"."mfa_recovery_codes" IS 'User''s MFA recovery codes';
COMMENT ON COLUMN "platform_users"."default_workspace_id" IS 'User''s default workspace after login';

-- platform_user_login_attempts comments
COMMENT ON COLUMN "platform_user_login_attempts"."mfa_method" IS 'MFA method used if applicable';
COMMENT ON COLUMN "platform_user_login_attempts"."mfa_required" IS 'Whether MFA was required for this attempt';
COMMENT ON COLUMN "platform_user_login_attempts"."mfa_successful" IS 'Whether MFA was successful';

-- platform_user_sessions comments
COMMENT ON COLUMN "platform_user_sessions"."ip_address" IS 'IP address of the session';
COMMENT ON COLUMN "platform_user_sessions"."user_agent" IS 'User agent string';
COMMENT ON COLUMN "platform_user_sessions"."last_activity_at" IS 'Last activity timestamp';

-- mfa_backup_codes comments
COMMENT ON COLUMN "mfa_backup_codes"."code_hash" IS 'The backup code hash';
COMMENT ON COLUMN "mfa_backup_codes"."is_used" IS 'Whether the code has been used';
COMMENT ON COLUMN "mfa_backup_codes"."used_at" IS 'When the code was used';
COMMENT ON COLUMN "mfa_backup_codes"."user_id" IS 'User who owns this backup code';

-- patrol_sessions comments
COMMENT ON COLUMN "patrol_sessions"."guard_profile_id" IS 'User ID of the guard who performed the patrol';
