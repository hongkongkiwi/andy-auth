-- Prisma Database Comments Generator v1.0.2

-- users comments
COMMENT ON COLUMN "users"."failedLoginAttempts" IS 'Number of consecutive failed login attempts';
COMMENT ON COLUMN "users"."lockoutUntil" IS 'Timestamp until which the user is locked out';
