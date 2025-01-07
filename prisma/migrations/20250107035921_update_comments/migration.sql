-- Prisma Database Comments Generator v1.0.2

-- Session comments
COMMENT ON COLUMN "Session"."geoPatrol" IS 'Patrol data for session';

-- client comments
COMMENT ON COLUMN "client"."max_patrols" IS 'Maximum number of patrols allowed';

-- patrol comments
COMMENT ON TABLE "patrol" IS 'Physical patrol for a client';
COMMENT ON COLUMN "patrol"."name" IS 'Display name of the patrol';
COMMENT ON COLUMN "patrol"."description" IS 'Optional patrol description';
COMMENT ON COLUMN "patrol"."status" IS 'Current patrol status';
COMMENT ON COLUMN "patrol"."addresses" IS 'Physical address information';
COMMENT ON COLUMN "patrol"."patrol_settings" IS 'Patrol configuration settings';
