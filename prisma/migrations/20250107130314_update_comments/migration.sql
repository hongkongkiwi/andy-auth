-- Prisma Database Comments Generator v1.0.2

-- AuthSession comments
COMMENT ON TABLE "AuthSession" IS 'Tracks authenticated user sessions across devices';
COMMENT ON COLUMN "AuthSession"."token" IS 'Unique session identifier';
COMMENT ON COLUMN "AuthSession"."expiresAt" IS 'Session expiration timestamp';
COMMENT ON COLUMN "AuthSession"."ipAddress" IS 'Client IP address';
COMMENT ON COLUMN "AuthSession"."userAgent" IS 'Client browser/app identifier';
COMMENT ON COLUMN "AuthSession"."lastActiveAt" IS 'Last activity timestamp';
COMMENT ON COLUMN "AuthSession"."isRevoked" IS 'Manual session termination flag';
COMMENT ON COLUMN "AuthSession"."deviceId" IS 'Unique device identifier';
COMMENT ON COLUMN "AuthSession"."deviceName" IS 'User-provided device name';
COMMENT ON COLUMN "AuthSession"."sessionType" IS 'Session type (web/mobile/api)';
COMMENT ON COLUMN "AuthSession"."geoPatrol" IS 'Patrol data for session';
COMMENT ON COLUMN "AuthSession"."mfaVerified" IS 'MFA completion status';
COMMENT ON COLUMN "AuthSession"."failedAttempts" IS 'Failed authentication count';
COMMENT ON COLUMN "AuthSession"."refreshToken" IS 'Session refresh token';
