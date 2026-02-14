import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db/connection";
import { users, userS3Credentials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db
    .select({
      encryptedBlob: userS3Credentials.encryptedBlob,
      vaultSalt: userS3Credentials.vaultSalt,
      awsRegion: userS3Credentials.awsRegion,
      bucketName: userS3Credentials.bucketName,
      isActive: userS3Credentials.isActive,
    })
    .from(users)
    .innerJoin(userS3Credentials, eq(users.id, userS3Credentials.userId))
    .where(eq(users.clerkUserId, userId))
    .limit(1);

  if (result.length === 0) {
    return NextResponse.json(
      { error: "No credentials found" },
      { status: 404 },
    );
  }

  const credentials = result[0];

  if (!credentials.isActive) {
    return NextResponse.json(
      { error: "Credentials are inactive" },
      { status: 403 },
    );
  }

  return NextResponse.json({
    encryptedBlob: credentials.encryptedBlob,
    vaultSalt: credentials.vaultSalt,
    awsRegion: credentials.awsRegion,
    bucketName: credentials.bucketName,
  });
}
