CREATE TABLE "user_s3_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"aws_access_key_id" text NOT NULL,
	"aws_secret_access_key" text NOT NULL,
	"aws_region" text NOT NULL,
	"bucket_name" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
ALTER TABLE "user_s3_credentials" ADD CONSTRAINT "user_s3_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;