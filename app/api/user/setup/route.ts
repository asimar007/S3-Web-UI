import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db/connection";
import { users, userS3Credentials } from "@/lib/db/schema";
import { encrypt } from "@/lib/encryption";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { awsAccessKeyId, awsSecretAccessKey, awsRegion, bucketName, email } =
    await request.json();

  if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion || !bucketName) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  // Find or create user
  let user = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, userId))
    .limit(1);

  if (user.length === 0) {
    const [newUser] = await db
      .insert(users)
      .values({
        clerkUserId: userId,
        email: email || "user@example.com",
      })
      .returning();
    user = [newUser];
  }

  // Check if credentials already exist
  const existingCredentials = await db
    .select()
    .from(userS3Credentials)
    .where(eq(userS3Credentials.userId, user[0].id))
    .limit(1);

  // Encrypt credentials
  const encryptedAccessKey = encrypt(awsAccessKeyId);
  const encryptedSecretKey = encrypt(awsSecretAccessKey);

  if (existingCredentials.length > 0) {
    // Update existing credentials
    await db
      .update(userS3Credentials)
      .set({
        awsAccessKeyId: encryptedAccessKey,
        awsSecretAccessKey: encryptedSecretKey,
        awsRegion,
        bucketName,
        updatedAt: new Date(),
      })
      .where(eq(userS3Credentials.userId, user[0].id));
  } else {
    // Insert new credentials
    await db.insert(userS3Credentials).values({
      userId: user[0].id,
      awsAccessKeyId: encryptedAccessKey,
      awsSecretAccessKey: encryptedSecretKey,
      awsRegion,
      bucketName,
    });
  }

  return NextResponse.json({ success: true });
}
