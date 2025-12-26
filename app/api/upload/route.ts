import { NextResponse, NextRequest } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getUserS3Client } from "@/lib/s3-client";

import { auth } from "@clerk/nextjs/server";
import { validateKey } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = request.nextUrl.searchParams.get("key");
  if (!key || !validateKey(key)) {
    return NextResponse.json(
      { error: "Invalid key or path traversal attempt" },
      { status: 400 }
    );
  }

  const s3Config = await getUserS3Client();

  if (!s3Config) {
    return NextResponse.json(
      {
        error: "No S3 credentials found. Please set up your AWS credentials.",
      },
      { status: 404 }
    );
  }

  const { client, bucketName } = s3Config;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return NextResponse.json({ url });
}
