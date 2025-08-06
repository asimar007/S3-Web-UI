import { pgTable, text, timestamp, boolean, serial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").unique().notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userS3Credentials = pgTable("user_s3_credentials", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  awsAccessKeyId: text("aws_access_key_id").notNull(), // encrypted
  awsSecretAccessKey: text("aws_secret_access_key").notNull(), // encrypted
  awsRegion: text("aws_region").notNull(),
  bucketName: text("bucket_name").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
