-- Prisma Database Comments Generator v1.0.2

-- ResourceMember comments
COMMENT ON TABLE "ResourceMember" IS 'Links users to resources with role-based access control';
COMMENT ON COLUMN "ResourceMember"."role" IS 'The member''s role for this resource';
COMMENT ON COLUMN "ResourceMember"."permissions" IS 'Additional granular permissions';
