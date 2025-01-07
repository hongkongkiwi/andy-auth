-- Prisma Database Comments Generator v1.0.2

-- ResourceMember comments
COMMENT ON TABLE "ResourceMember" IS 'Links users to resources with role-based access control (RBAC) but also supports additional gradular permissions';
COMMENT ON COLUMN "ResourceMember"."role" IS 'The member''s base role for this resource';
