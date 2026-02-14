import { relations } from "drizzle-orm/relations";
import { users, userS3Credentials } from "./schema";

export const userS3CredentialsRelations = relations(userS3Credentials, ({one}) => ({
	user: one(users, {
		fields: [userS3Credentials.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userS3Credentials: many(userS3Credentials),
}));