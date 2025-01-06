-- Prisma Database Comments Generator v1.0.2

-- incident comments
COMMENT ON COLUMN "incident"."assignedAt" IS 'When the incident was assigned';

-- platform_user comments
COMMENT ON TABLE "platform_user" IS 'Platform user model with authentication capabilities';
COMMENT ON COLUMN "platform_user"."emailAddress" IS 'User''s email address';
COMMENT ON COLUMN "platform_user"."emailAddressVerifiedAt" IS 'When email was verified';
COMMENT ON COLUMN "platform_user"."phoneNumber" IS 'User''s phone number';
COMMENT ON COLUMN "platform_user"."phoneNumberVerifiedAt" IS 'When phone was verified';
COMMENT ON COLUMN "platform_user"."passwordHash" IS 'Hashed password';
COMMENT ON COLUMN "platform_user"."passwordSalt" IS 'Password salt';
COMMENT ON COLUMN "platform_user"."mfaEnabled" IS 'Whether MFA is enabled';
COMMENT ON COLUMN "platform_user"."authenticationMethods" IS 'Allowed authentication methods';
COMMENT ON COLUMN "platform_user"."lastLoginAt" IS 'Last successful login';
COMMENT ON COLUMN "platform_user"."loginAttempts" IS 'Count of login attempts';
COMMENT ON COLUMN "platform_user"."lastLoginAttemptAt" IS 'Last login attempt timestamp';
COMMENT ON COLUMN "platform_user"."lockedAt" IS 'When account was locked';
COMMENT ON COLUMN "platform_user"."lockedReason" IS 'Reason for account lock';
COMMENT ON COLUMN "platform_user"."settings" IS 'User settings and preferences';
COMMENT ON COLUMN "platform_user"."status" IS 'Current status of the user';
COMMENT ON COLUMN "platform_user"."passwordLastChanged" IS E'Profile picture file\nPassword last changed';
COMMENT ON COLUMN "platform_user"."requirePasswordChange" IS 'Require password change';
COMMENT ON COLUMN "platform_user"."failedLoginAttempts" IS 'Failed login attempts';
COMMENT ON COLUMN "platform_user"."lastFailedLoginAt" IS 'Last failed login attempt';
COMMENT ON COLUMN "platform_user"."lockoutUntil" IS 'Lockout until';

-- auth_session comments
COMMENT ON TABLE "auth_session" IS 'Session for an authenticated user';
COMMENT ON COLUMN "auth_session"."token" IS 'Unique session token';
COMMENT ON COLUMN "auth_session"."isRevoked" IS 'Whether the session has been revoked';
COMMENT ON COLUMN "auth_session"."revokedAt" IS 'When the session was revoked';
COMMENT ON COLUMN "auth_session"."expiresAt" IS 'When the session expires';
COMMENT ON COLUMN "auth_session"."lastActiveAt" IS 'Last activity timestamp';
COMMENT ON COLUMN "auth_session"."ipAddress" IS 'IP address of the client';
COMMENT ON COLUMN "auth_session"."userAgent" IS 'User agent of the client';
COMMENT ON COLUMN "auth_session"."deviceId" IS 'Device ID';
COMMENT ON COLUMN "auth_session"."deviceName" IS 'Device name';
COMMENT ON COLUMN "auth_session"."geoLocation" IS 'Geo location';
COMMENT ON COLUMN "auth_session"."refreshToken" IS 'Session refresh token';

-- platform_user_verification_token comments
COMMENT ON TABLE "platform_user_verification_token" IS 'Verification token for user authentication';
COMMENT ON COLUMN "platform_user_verification_token"."identifier" IS 'Email or phone to verify';
COMMENT ON COLUMN "platform_user_verification_token"."token" IS 'Verification token';
COMMENT ON COLUMN "platform_user_verification_token"."type" IS 'Type of verification';
COMMENT ON COLUMN "platform_user_verification_token"."expiresAt" IS 'When the token expires';
COMMENT ON COLUMN "platform_user_verification_token"."createdAt" IS 'When the token was created';
COMMENT ON COLUMN "platform_user_verification_token"."updatedAt" IS 'When the record was last updated';
COMMENT ON COLUMN "platform_user_verification_token"."lastModifiedBy" IS 'Who last modified the record';
COMMENT ON COLUMN "platform_user_verification_token"."deletedAt" IS 'Soft delete timestamp';
COMMENT ON COLUMN "platform_user_verification_token"."deletedBy" IS 'Who deleted the record';

-- platform_user_login_attempt comments
COMMENT ON TABLE "platform_user_login_attempt" IS 'Track login attempts for security';
COMMENT ON COLUMN "platform_user_login_attempt"."isLoginFailed" IS 'Whether the login failed';
COMMENT ON COLUMN "platform_user_login_attempt"."failureReason" IS 'Reason for failure if applicable';
COMMENT ON COLUMN "platform_user_login_attempt"."ipAddress" IS 'IP address of the attempt';
COMMENT ON COLUMN "platform_user_login_attempt"."userAgent" IS 'User agent of the attempt';
COMMENT ON COLUMN "platform_user_login_attempt"."authMethod" IS 'Authentication method used';

-- security_event comments
COMMENT ON TABLE "security_event" IS 'Security event audit log';
COMMENT ON COLUMN "security_event"."type" IS 'Type of security event';
COMMENT ON COLUMN "security_event"."ipAddress" IS 'IP address of the event';
COMMENT ON COLUMN "security_event"."userAgent" IS 'User agent of the event';
COMMENT ON COLUMN "security_event"."metadata" IS 'Additional event metadata';

-- person_profile comments
COMMENT ON TABLE "person_profile" IS 'User profile information';
COMMENT ON COLUMN "person_profile"."firstName" IS 'User''s first name';
COMMENT ON COLUMN "person_profile"."lastName" IS 'User''s last name';
COMMENT ON COLUMN "person_profile"."emergencyContact" IS 'Emergency contact information';
COMMENT ON COLUMN "person_profile"."preferences" IS 'User preferences';

-- oauth_accounts comments
COMMENT ON TABLE "oauth_accounts" IS 'Add OAuth models';
