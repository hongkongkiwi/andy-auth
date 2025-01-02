-- Prisma Database Comments Generator v1.0.2

-- client_locations comments
COMMENT ON COLUMN "client_locations"."address" IS E'Contact people for this location\nAddress for this location';
COMMENT ON COLUMN "client_locations"."timezone" IS 'Timezone for scheduling and displays (format: Region/City)';
