import { NextRequest, NextResponse } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db/connection";
import { users, userS3Credentials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface S3Context {
  client: S3Client;
  bucketName: string;
  userId: string;
}

type S3Handler = (
  request: NextRequest,
  s3: S3Context,
) => Promise<Response> | Response;

/**
 * Wraps a route handler with Clerk auth and per-request S3 client construction.
 * AWS keys arrive in headers (zero-knowledge); region and bucket come from the DB.
 */
export function withS3(handler: S3Handler) {
  return async (request: NextRequest) => {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessKeyId = request.headers.get("x-aws-access-key-id");
    const secretAccessKey = request.headers.get("x-aws-secret-access-key");
    if (!accessKeyId || !secretAccessKey) {
      return NextResponse.json(
        { error: "No S3 credentials found. Please set up your AWS credentials." },
        { status: 404 },
      );
    }

    const result = await db
      .select({
        awsRegion: userS3Credentials.awsRegion,
        bucketName: userS3Credentials.bucketName,
      })
      .from(users)
      .innerJoin(userS3Credentials, eq(users.id, userS3Credentials.userId))
      .where(eq(users.clerkUserId, userId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "No S3 credentials found. Please set up your AWS credentials." },
        { status: 404 },
      );
    }

    const { awsRegion, bucketName } = result[0];
    const client = new S3Client({
      region: awsRegion,
      credentials: { accessKeyId, secretAccessKey },
    });

    return handler(request, { client, bucketName, userId });
  };
}
