ALTER TABLE "user_s3_credentials" ALTER COLUMN "aws_access_key_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_s3_credentials" ALTER COLUMN "aws_secret_access_key" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_s3_credentials" ADD COLUMN "encrypted_blob" text;--> statement-breakpoint
ALTER TABLE "user_s3_credentials" ADD COLUMN "vault_salt" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "vault_verification_token" text;