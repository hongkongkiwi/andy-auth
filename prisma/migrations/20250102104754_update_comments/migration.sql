-- Prisma Database Comments Generator v1.0.2

-- platform_user comments
COMMENT ON COLUMN "platform_user"."email_address" IS 'User''s email address';
COMMENT ON COLUMN "platform_user"."password_hash" IS 'Hashed password (includes salt)';
COMMENT ON COLUMN "platform_user"."password_expires_at" IS 'Password expiration date';
COMMENT ON COLUMN "platform_user"."password_reset_expires_at" IS 'Password reset token expiration';
COMMENT ON COLUMN "platform_user"."password_reset_attempts" IS 'Password reset attempts count';
COMMENT ON COLUMN "platform_user"."last_login_at" IS 'Last successful login';
COMMENT ON COLUMN "platform_user"."settings" IS 'User settings and preferences';
