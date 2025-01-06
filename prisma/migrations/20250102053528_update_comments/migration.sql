-- Prisma Database Comments Generator v1.0.2

-- incident comments
COMMENT ON TABLE "incident" IS 'Security incident record';
COMMENT ON COLUMN "incident"."title" IS 'Incident title/summary';
COMMENT ON COLUMN "incident"."description" IS 'Detailed incident description';
COMMENT ON COLUMN "incident"."status" IS 'Current incident status';
COMMENT ON COLUMN "incident"."occurredAt" IS 'When the incident occurred';
COMMENT ON COLUMN "incident"."location" IS 'Location where incident occurred';
COMMENT ON COLUMN "incident"."severity" IS 'Incident severity';
COMMENT ON COLUMN "incident"."category" IS 'Incident category';
COMMENT ON COLUMN "incident"."responseTime" IS 'Time to first response in minutes';
COMMENT ON COLUMN "incident"."resolutionTime" IS 'Time to resolution in minutes';
COMMENT ON COLUMN "incident"."assignedAt" IS E'Assigned user for handling the incident\nWhen the incident was assigned';
COMMENT ON COLUMN "incident"."priority" IS 'Priority level (1-5)';
COMMENT ON COLUMN "incident"."dueDate" IS 'Due date for resolution';
COMMENT ON COLUMN "incident"."tags" IS 'Tags for categorization';
