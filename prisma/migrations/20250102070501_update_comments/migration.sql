-- Prisma Database Comments Generator v1.0.2

-- auth_session comments
COMMENT ON TABLE "auth_session" IS 'Authentication session for a user';
COMMENT ON COLUMN "auth_session"."user_agent" IS 'User agent string of the client';
COMMENT ON COLUMN "auth_session"."device_id" IS 'Device identifier and info';
COMMENT ON COLUMN "auth_session"."device_name" IS NULL;
COMMENT ON COLUMN "auth_session"."geo_location" IS 'Location and metadata';
COMMENT ON COLUMN "auth_session"."metadata" IS NULL;
