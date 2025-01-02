-- Prisma Database Comments Generator v1.0.2

-- object_storage_files comments
COMMENT ON TABLE "object_storage_files" IS 'Object storage file model for files uploaded to S3, Azure, or GCP';
COMMENT ON COLUMN "object_storage_files"."storage_service" IS 'Object storage service name';
COMMENT ON COLUMN "object_storage_files"."object_key" IS 'Object storage key for the file';
COMMENT ON COLUMN "object_storage_files"."object_bucket" IS 'Object storage bucket for the file';
COMMENT ON COLUMN "object_storage_files"."object_region" IS 'Object storage region for the file';
COMMENT ON COLUMN "object_storage_files"."is_public_object" IS 'Whether the object is public';
COMMENT ON COLUMN "object_storage_files"."signed_get_url" IS 'Signed GET URL for the file';
COMMENT ON COLUMN "object_storage_files"."signed_get_url_expires_at" IS 'Signed GET URL expiration date';
COMMENT ON COLUMN "object_storage_files"."mime_type" IS 'MIME type of the file';
COMMENT ON COLUMN "object_storage_files"."modified_at" IS 'Modified date of the file';
COMMENT ON COLUMN "object_storage_files"."size" IS 'Size of the file';
COMMENT ON COLUMN "object_storage_files"."e_tag" IS 'ETag of the file (MD5 hash)';
COMMENT ON COLUMN "object_storage_files"."version_id" IS 'Version ID (if versioning is enabled on the bucket)';
COMMENT ON COLUMN "object_storage_files"."server_side_encryption" IS 'Server-side encryption algorithm';
COMMENT ON COLUMN "object_storage_files"."content_encoding" IS 'Content encoding (e.g., gzip)';
COMMENT ON COLUMN "object_storage_files"."content_disposition" IS 'Content disposition (e.g., inline, attachment)';
COMMENT ON COLUMN "object_storage_files"."original_filename" IS 'Original filename when uploaded';
COMMENT ON COLUMN "object_storage_files"."storage_class" IS 'Storage class (e.g., STANDARD, STANDARD_IA, GLACIER)';
COMMENT ON COLUMN "object_storage_files"."metadata" IS 'Metadata of the file';

-- workspaces comments
COMMENT ON TABLE "workspaces" IS 'A workspace is the top-level organizational unit that contains clients, users, and devices';
COMMENT ON COLUMN "workspaces"."display_name" IS 'The display name for the workspace (can contain spaces and special characters)';
COMMENT ON COLUMN "workspaces"."company_name" IS 'The unique legal/registered company name across all workspaces';
COMMENT ON COLUMN "workspaces"."contact_persons" IS 'List of contact persons associated with this workspace';
COMMENT ON COLUMN "workspaces"."company_email" IS 'Primary business email for official communications';
COMMENT ON COLUMN "workspaces"."company_website" IS 'Official company website URL';
COMMENT ON COLUMN "workspaces"."company_phone_number" IS 'Primary contact phone number in international format (+XXXXXXXXXXX)';
COMMENT ON COLUMN "workspaces"."timezone" IS 'Timezone for scheduling and displays (format: Region/City)';
COMMENT ON COLUMN "workspaces"."workspace_status" IS 'Status of the workspace';

-- clients comments
COMMENT ON TABLE "clients" IS 'Client is a company or organization attached to a workspace';
COMMENT ON COLUMN "clients"."display_name" IS 'Display name for the client';
COMMENT ON COLUMN "clients"."company_name" IS 'Company name for the client';
COMMENT ON COLUMN "clients"."client_email" IS 'Primary business email for official communications';
COMMENT ON COLUMN "clients"."client_website" IS 'Official company website URL';
COMMENT ON COLUMN "clients"."client_phone_number" IS 'Primary contact phone number in international format (+XXXXXXXXXXX)';
COMMENT ON COLUMN "clients"."address" IS 'Address for the client';
COMMENT ON COLUMN "clients"."contact_people" IS 'Contact people for the client';
COMMENT ON COLUMN "clients"."workspace_id" IS 'Reference to the workspace this client belongs to';

-- client_locations comments
COMMENT ON COLUMN "client_locations"."contact_people" IS 'Contact people for this location';
COMMENT ON COLUMN "client_locations"."address" IS 'Address for this location';
COMMENT ON COLUMN "client_locations"."timezone" IS 'Timezone for scheduling and displays (format: Region/City)';
COMMENT ON COLUMN "client_locations"."location_type" IS 'Type of location';
COMMENT ON COLUMN "client_locations"."client_id" IS 'Reference to the client ID this location belongs to';
COMMENT ON COLUMN "client_locations"."workspace_id" IS 'Workspace ID for this location';

-- platform_users comments
COMMENT ON TABLE "platform_users" IS 'Platform-wide user model';
COMMENT ON COLUMN "platform_users"."personProfile" IS 'Person profile specific to the user';
COMMENT ON COLUMN "platform_users"."email_address" IS 'Email address for this user';
COMMENT ON COLUMN "platform_users"."email_address_verified_at" IS 'Date when email address was verified or null if not verified';
COMMENT ON COLUMN "platform_users"."phone_number" IS 'Phone number in E.164 format';
COMMENT ON COLUMN "platform_users"."phone_number_verified_at" IS 'Date when phone number was verified or null if not verified';
COMMENT ON COLUMN "platform_users"."is_guard" IS 'Whether this user is a guard';
COMMENT ON COLUMN "platform_users"."guard_staff_id" IS 'Unique ID for guard staff';
COMMENT ON COLUMN "platform_users"."guard_pin_number" IS 'PIN number for on-device authentication';
COMMENT ON COLUMN "platform_users"."user_password" IS E'Guard Documents\nHashed password for local authentication';
COMMENT ON COLUMN "platform_users"."is_two_factor_enabled" IS 'Whether two-factor authentication is enabled for this user';
COMMENT ON COLUMN "platform_users"."user_status" IS 'Current status of the user account';
COMMENT ON COLUMN "platform_users"."language_locale" IS 'User''s preferred locale/language';
COMMENT ON COLUMN "platform_users"."timezone" IS 'User''s timezone';
COMMENT ON COLUMN "platform_users"."is_onboarding_completed" IS 'Whether user has completed initial onboarding';
COMMENT ON COLUMN "platform_users"."terms_accepted_at" IS 'Date when terms were accepted';
COMMENT ON COLUMN "platform_users"."force_password_change" IS 'Force password change on next login';
COMMENT ON COLUMN "platform_users"."last_password_change_at" IS 'Last password change timestamp';
COMMENT ON COLUMN "platform_users"."login_locked_until" IS 'Login Locked Until';
COMMENT ON COLUMN "platform_users"."settings" IS 'User''s settings';

-- platform_user_login_attempts comments
COMMENT ON TABLE "platform_user_login_attempts" IS 'Platform User login attempts';
COMMENT ON COLUMN "platform_user_login_attempts"."user_id" IS 'User''s id';
COMMENT ON COLUMN "platform_user_login_attempts"."isLoginFailed" IS 'Whether the login attempt was successful';
COMMENT ON COLUMN "platform_user_login_attempts"."ip_address" IS 'IP address of the login attempt';
COMMENT ON COLUMN "platform_user_login_attempts"."location" IS 'Location of the login attempt';
COMMENT ON COLUMN "platform_user_login_attempts"."user_agent" IS 'User agent string from the login attempt';
COMMENT ON COLUMN "platform_user_login_attempts"."device_type" IS 'Device type (mobile, desktop, tablet, etc.)';
COMMENT ON COLUMN "platform_user_login_attempts"."browser" IS 'Browser name and version';
COMMENT ON COLUMN "platform_user_login_attempts"."operating_system" IS 'Operating system';
COMMENT ON COLUMN "platform_user_login_attempts"."failure_reason" IS 'Failure reason if the attempt failed (wrong password, invalid token, etc.)';
COMMENT ON COLUMN "platform_user_login_attempts"."auth_method" IS 'Authentication method used (password, oauth, webauthn, etc.)';
COMMENT ON COLUMN "platform_user_login_attempts"."session_id" IS 'Session ID if login was successful';
COMMENT ON COLUMN "platform_user_login_attempts"."risk_score" IS 'Risk score (if you implement risk-based authentication)';

-- platform_user_accounts comments
COMMENT ON TABLE "platform_user_accounts" IS 'Authentication accounts linked to a user';
COMMENT ON COLUMN "platform_user_accounts"."user_id" IS 'Reference to the user who owns this account';
COMMENT ON COLUMN "platform_user_accounts"."type" IS 'Type of OAuth account (oauth, email, etc)';
COMMENT ON COLUMN "platform_user_accounts"."provider" IS 'OAuth provider name (google, github, etc)';
COMMENT ON COLUMN "platform_user_accounts"."provider_account_id" IS 'Unique ID from the OAuth provider';
COMMENT ON COLUMN "platform_user_accounts"."refresh_token" IS 'OAuth refresh token used to obtain new access tokens';
COMMENT ON COLUMN "platform_user_accounts"."access_token" IS 'OAuth access token for API requests';
COMMENT ON COLUMN "platform_user_accounts"."expires_at" IS 'Timestamp when the access token expires';
COMMENT ON COLUMN "platform_user_accounts"."token_type" IS 'Type of OAuth token (e.g., Bearer)';
COMMENT ON COLUMN "platform_user_accounts"."scope" IS 'OAuth permission scopes granted to the application';
COMMENT ON COLUMN "platform_user_accounts"."id_token" IS 'JWT token containing user information';
COMMENT ON COLUMN "platform_user_accounts"."session_state" IS 'OAuth session state for security validation';

-- platform_user_sessions comments
COMMENT ON COLUMN "platform_user_sessions"."session_token" IS 'Unique session token';
COMMENT ON COLUMN "platform_user_sessions"."user_id" IS 'Reference to the user who owns this session';
COMMENT ON COLUMN "platform_user_sessions"."expiresAt" IS 'Date when session expires';

-- verification_tokens comments
COMMENT ON COLUMN "verification_tokens"."identifier" IS 'User identifier (email or phone)';
COMMENT ON COLUMN "verification_tokens"."token" IS 'Verification token';
COMMENT ON COLUMN "verification_tokens"."type" IS 'Type of verification token';

-- authenticators comments
COMMENT ON COLUMN "authenticators"."credential_id" IS 'Unique identifier for the WebAuthn credential';
COMMENT ON COLUMN "authenticators"."provider_account_id" IS 'Provider account ID';
COMMENT ON COLUMN "authenticators"."credential_public_key" IS 'Public key used for WebAuthn authentication';
COMMENT ON COLUMN "authenticators"."counter" IS 'Signature counter to prevent replay attacks';
COMMENT ON COLUMN "authenticators"."credential_device_type" IS 'Type of authenticator device (e.g., platform, cross-platform)';
COMMENT ON COLUMN "authenticators"."is_credential_backed_up" IS 'Indicates if credential is synced/backed up';
COMMENT ON COLUMN "authenticators"."transports" IS 'Allowed authentication transport methods (e.g., usb, nfc, ble)';
COMMENT ON COLUMN "authenticators"."user_id" IS 'Associated user ID who owns this authenticator';

-- workspace_permissions comments
COMMENT ON COLUMN "workspace_permissions"."permissions" IS 'Array of permission strings defining access rights for this workspace';
COMMENT ON COLUMN "workspace_permissions"."user_id" IS 'Reference to the user ID who has these workspace permissions';
COMMENT ON COLUMN "workspace_permissions"."workspace_id" IS 'Reference to the workspace ID these permissions apply to';

-- client_permissions comments
COMMENT ON COLUMN "client_permissions"."permissions" IS 'Array of permission strings defining access rights for this client';
COMMENT ON COLUMN "client_permissions"."user_id" IS 'Reference to the user ID who has these client permissions';
COMMENT ON COLUMN "client_permissions"."client_id" IS 'Reference to the client ID these permissions apply to';

-- client_location_permissions comments
COMMENT ON COLUMN "client_location_permissions"."permissions" IS 'Array of permission strings defining access rights for this client location';
COMMENT ON COLUMN "client_location_permissions"."user_id" IS 'Reference to the user ID who has these location permissions';
COMMENT ON COLUMN "client_location_permissions"."location_id" IS 'Reference to the location ID these permissions apply to';

-- patrol_routes comments
COMMENT ON TABLE "patrol_routes" IS 'A route for a guard to patrol';
COMMENT ON COLUMN "patrol_routes"."route_name" IS 'Name of the patrol route';
COMMENT ON COLUMN "patrol_routes"."description" IS 'Description of the patrol route';
COMMENT ON COLUMN "patrol_routes"."geoFence" IS 'GeoFence for the patrol route';
COMMENT ON COLUMN "patrol_routes"."clientId" IS 'Reference to the client ID this patrol route belongs to';
COMMENT ON COLUMN "patrol_routes"."workspaceId" IS 'Reference to the workspace ID this patrol route belongs to';

-- patrol_sessions comments
COMMENT ON COLUMN "patrol_sessions"."patrol_route_id" IS 'Reference to the patrol route ID this patrol session belongs to';
COMMENT ON COLUMN "patrol_sessions"."device_id" IS 'Reference to the device ID this patrol session belongs to';
COMMENT ON COLUMN "patrol_sessions"."user_id" IS 'User ID of the guard who performed the patrol';

-- checkpoints comments
COMMENT ON COLUMN "checkpoints"."name" IS 'Display name for the checkpoint';
COMMENT ON COLUMN "checkpoints"."description" IS 'Description for the checkpoint';
COMMENT ON COLUMN "checkpoints"."qr_code" IS 'QR code for the checkpoint';
COMMENT ON COLUMN "checkpoints"."nfc_tag_id" IS 'NFC tag for the checkpoint';
COMMENT ON COLUMN "checkpoints"."address" IS 'Address for the checkpoint';
COMMENT ON COLUMN "checkpoints"."coordinates" IS 'Coordinates for the checkpoint';
COMMENT ON COLUMN "checkpoints"."location_id" IS 'Reference to the location ID this checkpoint belongs to';

-- checkpoint_scans comments
COMMENT ON TABLE "checkpoint_scans" IS 'A scan of a checkpoint during a patrol';
COMMENT ON COLUMN "checkpoint_scans"."scannedAt" IS 'Date and time of the scan';
COMMENT ON COLUMN "checkpoint_scans"."patrol_route_id" IS 'Reference to the patrol route ID this checkpoint scan belongs to';
COMMENT ON COLUMN "checkpoint_scans"."checkpoint_id" IS 'Reference to the checkpoint ID this checkpoint scan belongs to';
COMMENT ON COLUMN "checkpoint_scans"."device_id" IS 'Reference to the device ID this checkpoint scan belongs to';

-- incidents comments
COMMENT ON COLUMN "incidents"."shortSummary" IS 'Short summary for the incident';
COMMENT ON COLUMN "incidents"."description" IS 'Description for the incident';
COMMENT ON COLUMN "incidents"."is_in_progress" IS 'Whether the incident is currently in progress';
COMMENT ON COLUMN "incidents"."priority_id" IS 'Reference to the priority for this incident';
COMMENT ON COLUMN "incidents"."status_id" IS 'Reference to the status for this incident';
COMMENT ON COLUMN "incidents"."device_id" IS 'Reference to the device ID this incident belongs to';
COMMENT ON COLUMN "incidents"."client_id" IS 'Reference to the client this incident belongs to';
COMMENT ON COLUMN "incidents"."location_id" IS 'Reference to the location ID this incident belongs to';
COMMENT ON COLUMN "incidents"."workspace_id" IS 'Reference to the workspace this incident belongs to';

-- devices comments
COMMENT ON TABLE "devices" IS 'Body camera, mobile device attached to a client';
COMMENT ON COLUMN "devices"."device_name" IS 'Name of the device  ';
COMMENT ON COLUMN "devices"."device_model" IS 'Model of the device';
COMMENT ON COLUMN "devices"."serial_number" IS 'Serial number of the device';
COMMENT ON COLUMN "devices"."mqtt_iot_thing_name" IS 'MQTT IoT Thing Name';
COMMENT ON COLUMN "devices"."mqtt_iot_client_id" IS 'MQTT IoT Client ID';
COMMENT ON COLUMN "devices"."mqtt_iot_shadow" IS 'MQTT IoT Shadow';
COMMENT ON COLUMN "devices"."device_type" IS 'Type of device';
COMMENT ON COLUMN "devices"."device_status" IS 'Status of the device';
COMMENT ON COLUMN "devices"."workspaceId" IS 'Reference to the workspace ID this device belongs to';
COMMENT ON COLUMN "devices"."clientId" IS 'Reference to the client ID this device belongs to';
