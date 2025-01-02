-- Prisma Database Comments Generator v1.0.2

-- workspaces comments
COMMENT ON COLUMN "workspaces"."company_email" IS E'List of contact persons associated with this workspace\nPrimary business email for official communications';

-- clients comments
COMMENT ON COLUMN "clients"."workspace_id" IS E'Address for the client\nContact people for the client\nReference to the workspace this client belongs to';

-- client_locations comments
COMMENT ON COLUMN "client_locations"."timezone" IS E'Contact people for this location\nAddress for this location\nTimezone for scheduling and displays (format: Region/City)';
