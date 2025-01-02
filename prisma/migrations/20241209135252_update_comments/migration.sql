-- Prisma Database Comments Generator v1.0.2

-- user_profiles comments
COMMENT ON COLUMN "user_profiles"."user_id" IS 'User this profile belongs to';

-- platform_users comments
COMMENT ON COLUMN "platform_users"."person_profile_id" IS 'Person profile specific to the user';
