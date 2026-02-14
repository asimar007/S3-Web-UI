import { NextRequest } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db/connection";
import { users, userS3Credentials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getS3Client(req: NextRequest): Promise<{
  client: S3Client;
  bucketName: string;
} | null> {
  const { userId } = await auth();
  if (!userId) return null;

  // 1. Get credentials from Headers (Zero-Knowledge)
  const accessKeyId = req.headers.get("x-aws-access-key-id");
  const secretAccessKey = req.headers.get("x-aws-secret-access-key");

  if (!accessKeyId || !secretAccessKey) {
    console.error(
      "Missing AWS credentials in headers. Keys present:",
      [...req.headers.keys()].filter((k) => k.startsWith("x-aws")),
    );
    return null;
  }

  // 2. Get Region & Bucket from DB (Stored in plaintext)
  const result = await db
    .select({
      awsRegion: userS3Credentials.awsRegion,
      bucketName: userS3Credentials.bucketName,
      isActive: userS3Credentials.isActive,
    })
    .from(users)
    .innerJoin(userS3Credentials, eq(users.id, userS3Credentials.userId))
    .where(eq(users.clerkUserId, userId))
    .limit(1);

  if (result.length === 0) {
    console.error("No S3 credentials record found in DB for user", userId);
    return null;
  }

  if (!result[0].isActive) {
    console.error("S3 credentials record is inactive for user", userId);
    return null;
  }

  const { awsRegion, bucketName } = result[0];

  const client = new S3Client({
    region: awsRegion,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return { client, bucketName };
}
