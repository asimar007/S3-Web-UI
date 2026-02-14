import { pgTable, unique, serial, text, timestamp, foreignKey, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	clerkUserId: text("clerk_user_id").notNull(),
	email: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_clerk_user_id_unique").on(table.clerkUserId),
]);

export const userS3Credentials = pgTable("user_s3_credentials", {
	id: serial().primaryKey().notNull(),
	userId: serial("user_id").notNull(),
	awsRegion: text("aws_region").notNull(),
	bucketName: text("bucket_name").notNull(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	encryptedBlob: text("encrypted_blob"),
	vaultSalt: text("vault_salt"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_s3_credentials_user_id_users_id_fk"
		}),
]);
