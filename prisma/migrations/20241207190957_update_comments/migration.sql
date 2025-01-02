-- Prisma Database Comments Generator v1.0.2

-- clients comments
COMMENT ON COLUMN "clients"."address" IS 'Address for the client';
COMMENT ON COLUMN "clients"."workspace_id" IS E'Contact people for the client\nReference to the workspace this client belongs to';

-- checkpoints comments
COMMENT ON COLUMN "checkpoints"."address" IS 'Address for the checkpoint';
COMMENT ON COLUMN "checkpoints"."coordinates" IS 'Coordinates for the checkpoint';
