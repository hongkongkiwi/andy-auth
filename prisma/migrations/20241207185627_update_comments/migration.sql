-- Prisma Database Comments Generator v1.0.2

-- clients comments
COMMENT ON COLUMN "clients"."contact_people" IS E'Address for the client\nContact people for the client';

-- client_locations comments
COMMENT ON COLUMN "client_locations"."timezone" IS E'Address for this location\nTimezone for scheduling and displays (format: Region/City)';

-- checkpoints comments
COMMENT ON COLUMN "checkpoints"."coordinates" IS E'Address for the checkpoint\nCoordinates for the checkpoint';
