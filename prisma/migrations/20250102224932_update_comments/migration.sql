-- Prisma Database Comments Generator v1.0.2

-- audit_logs comments
COMMENT ON TABLE "audit_logs" IS 'Audit log entry for security events';
COMMENT ON COLUMN "audit_logs"."user_id" IS 'User who performed the action';
COMMENT ON COLUMN "audit_logs"."event_type" IS 'Type of event';
COMMENT ON COLUMN "audit_logs"."description" IS 'Human-readable description';
COMMENT ON COLUMN "audit_logs"."resource_type" IS 'Resource type affected';
COMMENT ON COLUMN "audit_logs"."resource_id" IS 'ID of affected resource';
COMMENT ON COLUMN "audit_logs"."ip_address" IS 'IP address of request';
COMMENT ON COLUMN "audit_logs"."user_agent" IS 'User agent string';
COMMENT ON COLUMN "audit_logs"."success" IS 'Success/failure indicator';
COMMENT ON COLUMN "audit_logs"."metadata" IS 'Additional event metadata';
COMMENT ON COLUMN "audit_logs"."trace_id" IS 'Request trace ID for correlation';
COMMENT ON COLUMN "audit_logs"."session_id" IS 'Session ID if applicable';
COMMENT ON COLUMN "audit_logs"."severity_level" IS 'Severity level';
