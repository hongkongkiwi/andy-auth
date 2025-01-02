-- Prisma Database Comments Generator v1.0.2

-- patrol_routes comments
COMMENT ON COLUMN "patrol_routes"."location_id" IS 'Reference to the location ID this patrol route belongs to';

-- checkpoints comments
COMMENT ON COLUMN "checkpoints"."type" IS 'Checkpoint type for the checkpoint';
