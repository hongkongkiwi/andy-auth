-- Prisma Database Comments Generator v1.0.2

-- platform_user_verification_tokens comments
COMMENT ON COLUMN "platform_user_verification_tokens"."identifier" IS 'User identifier (email or phone)';
COMMENT ON COLUMN "platform_user_verification_tokens"."token" IS 'Verification token';
COMMENT ON COLUMN "platform_user_verification_tokens"."type" IS 'Type of verification token';

-- platform_user_authenticators comments
COMMENT ON COLUMN "platform_user_authenticators"."credential_id" IS 'Unique identifier for the WebAuthn credential';
COMMENT ON COLUMN "platform_user_authenticators"."provider_account_id" IS 'Provider account ID';
COMMENT ON COLUMN "platform_user_authenticators"."credential_public_key" IS 'Public key used for WebAuthn authentication';
COMMENT ON COLUMN "platform_user_authenticators"."counter" IS 'Signature counter to prevent replay attacks';
COMMENT ON COLUMN "platform_user_authenticators"."credential_device_type" IS 'Type of authenticator device (e.g., platform, cross-platform)';
COMMENT ON COLUMN "platform_user_authenticators"."is_credential_backed_up" IS 'Indicates if credential is synced/backed up';
COMMENT ON COLUMN "platform_user_authenticators"."transports" IS 'Allowed authentication transport methods (e.g., usb, nfc, ble)';
COMMENT ON COLUMN "platform_user_authenticators"."user_id" IS 'Associated user ID who owns this authenticator';
