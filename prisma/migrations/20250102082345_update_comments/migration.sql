-- Prisma Database Comments Generator v1.0.2

-- platform_user comments
COMMENT ON COLUMN "platform_user"."email_address" IS E'Core auth fields\nUser''s email address';
COMMENT ON COLUMN "platform_user"."last_login_at" IS E'Security tracking\nLast successful login';
COMMENT ON COLUMN "platform_user"."settings" IS E'Profile and settings\nUser settings and preferences';

-- auth_session comments
COMMENT ON COLUMN "auth_session"."device_id" IS 'Device identifier';
COMMENT ON COLUMN "auth_session"."device_name" IS 'Human-readable device name';
COMMENT ON COLUMN "auth_session"."device_info" IS 'Detailed device information';
COMMENT ON COLUMN "auth_session"."geo_location" IS 'Geo location data';
COMMENT ON COLUMN "auth_session"."metadata" IS 'Additional session metadata';

-- platform_user_verification_token comments
COMMENT ON COLUMN "platform_user_verification_token"."token" IS 'Verification token value';
COMMENT ON COLUMN "platform_user_verification_token"."expires_at" IS 'When the token expires';
COMMENT ON COLUMN "platform_user_verification_token"."type" IS 'Type of verification (handled by application)';
