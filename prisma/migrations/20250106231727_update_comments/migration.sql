-- Prisma Database Comments Generator v1.0.2

-- OAuthAccount comments
COMMENT ON TABLE "OAuthAccount" IS 'Tracks OAuth provider accounts linked to users';
COMMENT ON COLUMN "OAuthAccount"."provider" IS 'OAuth provider type (e.g., ''google'', ''github'')';
COMMENT ON COLUMN "OAuthAccount"."providerAccountId" IS 'Provider-specific account identifier';
COMMENT ON COLUMN "OAuthAccount"."accessToken" IS 'OAuth access token';
COMMENT ON COLUMN "OAuthAccount"."refreshToken" IS 'OAuth refresh token';
COMMENT ON COLUMN "OAuthAccount"."expiresAt" IS 'Access token expiration';
COMMENT ON COLUMN "OAuthAccount"."scope" IS 'OAuth scope permissions';
COMMENT ON COLUMN "OAuthAccount"."idToken" IS 'ID token for OpenID Connect';
COMMENT ON COLUMN "OAuthAccount"."tokenType" IS 'Token type (e.g., ''bearer'')';
COMMENT ON COLUMN "OAuthAccount"."sessionState" IS 'Session state';
