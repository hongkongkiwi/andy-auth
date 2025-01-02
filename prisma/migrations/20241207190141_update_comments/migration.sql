-- Prisma Database Comments Generator v1.0.2

-- client_locations comments
COMMENT ON COLUMN "client_locations"."contact_people" IS 'Contact people for this location';
COMMENT ON COLUMN "client_locations"."timezone" IS E'Address for this location\nTimezone for scheduling and displays (format: Region/City)';
