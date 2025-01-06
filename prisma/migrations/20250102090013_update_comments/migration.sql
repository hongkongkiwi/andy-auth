-- Prisma Database Comments Generator v1.0.2

-- audit_log comments
COMMENT ON TABLE "audit_log" IS 'System-wide audit log for tracking events';
COMMENT ON COLUMN "audit_log"."type" IS 'Type of security event';
COMMENT ON COLUMN "audit_log"."ip_address" IS 'IP address of the event';
COMMENT ON COLUMN "audit_log"."user_agent" IS 'User agent of the event';
COMMENT ON COLUMN "audit_log"."description" IS 'Event description';
COMMENT ON COLUMN "audit_log"."resource_type" IS 'Resource type affected (e.g., "workspace", "client", "user")';
COMMENT ON COLUMN "audit_log"."resource_id" IS 'Resource ID affected';
COMMENT ON COLUMN "audit_log"."success" IS 'Success or failure status';
COMMENT ON COLUMN "audit_log"."metadata" IS 'Additional event metadata';
