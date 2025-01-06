-- Prisma Database Comments Generator v1.0.2

-- object_storage_files comments
COMMENT ON TABLE "object_storage_files" IS 'File stored in object storage (S3, Azure, GCP)';
COMMENT ON COLUMN "object_storage_files"."storageService" IS 'Storage service provider';
COMMENT ON COLUMN "object_storage_files"."objectKey" IS 'Storage object key/path';
COMMENT ON COLUMN "object_storage_files"."objectBucket" IS 'Storage bucket name';
COMMENT ON COLUMN "object_storage_files"."signedUrl" IS 'Temporary signed URL for access';
COMMENT ON COLUMN "object_storage_files"."mimeType" IS 'File MIME type';
COMMENT ON COLUMN "object_storage_files"."size" IS 'File size in bytes';
COMMENT ON COLUMN "object_storage_files"."originalFilename" IS 'Original uploaded filename';
COMMENT ON COLUMN "object_storage_files"."thumbnailUrl" IS 'URL to thumbnail image';
COMMENT ON COLUMN "object_storage_files"."metadata" IS 'Additional file metadata';
