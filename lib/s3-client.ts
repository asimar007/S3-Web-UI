import { S3Client } from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db/connection";
import { users, userS3Credentials } from "@/lib/db/schema";
import { decrypt } from "@/lib/encryption";
import { eq } from "drizzle-orm";

export async function getUserS3Client(): Promise<{
  client: S3Client;
  bucketName: string;
} | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const result = await db
    .select({
      awsAccessKeyId: userS3Credentials.awsAccessKeyId,
      awsSecretAccessKey: userS3Credentials.awsSecretAccessKey,
      awsRegion: userS3Credentials.awsRegion,
      bucketName: userS3Credentials.bucketName,
      isActive: userS3Credentials.isActive,
    })
    .from(users)
    .innerJoin(userS3Credentials, eq(users.id, userS3Credentials.userId))
    .where(eq(users.clerkUserId, userId))
    .limit(1);

  if (result.length === 0 || !result[0].isActive) {
    return null;
  }

  const credentials = result[0];

  const client = new S3Client({
    region: credentials.awsRegion,
    credentials: {
      accessKeyId: decrypt(credentials.awsAccessKeyId),
      secretAccessKey: decrypt(credentials.awsSecretAccessKey),
    },
  });

  return { client, bucketName: credentials.bucketName };
}
