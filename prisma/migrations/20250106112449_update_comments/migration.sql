-- Prisma Database Comments Generator v1.0.2

-- User comments
COMMENT ON TABLE "User" IS 'Core user model with authentication, profile, and relationship data';
COMMENT ON COLUMN "User"."email" IS 'Primary email address for account access and notifications';
COMMENT ON COLUMN "User"."emailVerified" IS 'When email verification was completed';
COMMENT ON COLUMN "User"."phoneNumber" IS 'Contact phone number for account recovery and 2FA';
COMMENT ON COLUMN "User"."phoneVerified" IS 'When phone verification was completed';
COMMENT ON COLUMN "User"."mfaEnabled" IS 'MFA status flag';
COMMENT ON COLUMN "User"."lastLoginAt" IS 'Last successful authentication timestamp';
COMMENT ON COLUMN "User"."status" IS 'Account status';
COMMENT ON COLUMN "User"."isPlatformAdmin" IS 'Platform administrator access flag';
COMMENT ON COLUMN "User"."name" IS 'Display name for the user';

-- WorkspaceMember comments
COMMENT ON TABLE "WorkspaceMember" IS 'Links users to workspaces with specific permission sets';
COMMENT ON COLUMN "WorkspaceMember"."permissions" IS 'Granted workspace-level permissions';

-- ClientMember comments
COMMENT ON TABLE "ClientMember" IS 'Links users to clients with specific permission sets';
COMMENT ON COLUMN "ClientMember"."permissions" IS 'Granted client-level permissions';

-- LocationMember comments
COMMENT ON TABLE "LocationMember" IS 'Links users to locations with specific permission sets';
COMMENT ON COLUMN "LocationMember"."permissions" IS 'Granted location-level permissions';

-- Session comments
COMMENT ON TABLE "Session" IS 'Tracks authenticated user sessions across devices';
COMMENT ON COLUMN "Session"."token" IS 'Unique session identifier';
COMMENT ON COLUMN "Session"."expiresAt" IS 'Session expiration timestamp';
COMMENT ON COLUMN "Session"."ipAddress" IS 'Client IP address';
COMMENT ON COLUMN "Session"."userAgent" IS 'Client browser/app identifier';
COMMENT ON COLUMN "Session"."lastActiveAt" IS 'Last activity timestamp';
COMMENT ON COLUMN "Session"."isRevoked" IS 'Manual session termination flag';
COMMENT ON COLUMN "Session"."deviceId" IS 'Unique device identifier';
COMMENT ON COLUMN "Session"."deviceName" IS 'User-provided device name';
COMMENT ON COLUMN "Session"."sessionType" IS 'Session type (web/mobile/api)';
COMMENT ON COLUMN "Session"."geoLocation" IS 'Location data for session';
COMMENT ON COLUMN "Session"."mfaVerified" IS 'MFA completion status';
COMMENT ON COLUMN "Session"."failedAttempts" IS 'Failed authentication count';
COMMENT ON COLUMN "Session"."refreshToken" IS 'Session refresh token';

-- workspace comments
COMMENT ON TABLE "workspace" IS NULL;
