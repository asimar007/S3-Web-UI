import { NextResponse, NextRequest } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/lib/s3-client";

import { auth } from "@clerk/nextjs/server";
import { validateKey } from "@/lib/utils";

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = request.nextUrl.searchParams.get("key");
  if (!key || !validateKey(key)) {
    return NextResponse.json(
      { error: "Invalid key or path traversal attempt" },
      { status: 400 },
    );
  }

  const s3Config = await getS3Client(request);
  if (!s3Config) {
    return NextResponse.json(
      { error: "No S3 credentials found" },
      { status: 404 },
    );
  }

  const { client, bucketName } = s3Config;

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await client.send(command);

    return NextResponse.json({
      success: true,
      message: `File deleted successfully`,
    });
  } catch (error) {
    console.error("Delete operation failed for user:", userId);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
}
