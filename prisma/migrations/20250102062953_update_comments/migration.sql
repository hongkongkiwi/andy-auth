-- Prisma Database Comments Generator v1.0.2

-- auth_session comments
COMMENT ON COLUMN "auth_session"."device" IS 'Device and location information';
COMMENT ON COLUMN "auth_session"."metadata" IS 'Session metadata';

-- object_storage_files comments
COMMENT ON COLUMN "object_storage_files"."fileMetadata" IS 'File metadata';
