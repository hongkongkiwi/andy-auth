-- Prisma Database Comments Generator v1.0.2

-- platform_users comments
COMMENT ON TABLE "platform_users" IS 'Platform user model with authentication capabilities';

-- auth_sessions comments
COMMENT ON TABLE "auth_sessions" IS 'Authentication session for a user';

-- audit_logs comments
COMMENT ON TABLE "audit_logs" IS 'Audit log for security events';
COMMENT ON COLUMN "audit_logs"."event_type" IS NULL;
COMMENT ON COLUMN "audit_logs"."resource_type" IS NULL;
COMMENT ON COLUMN "audit_logs"."resource_id" IS NULL;
COMMENT ON COLUMN "audit_logs"."user_id" IS NULL;
COMMENT ON COLUMN "audit_logs"."description" IS NULL;
COMMENT ON COLUMN "audit_logs"."metadata" IS NULL;
COMMENT ON COLUMN "audit_logs"."success" IS NULL;

-- oauth_accounts comments
COMMENT ON TABLE "oauth_accounts" IS 'OAuth account model';
