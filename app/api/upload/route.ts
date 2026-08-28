import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { withS3 } from "@/lib/s3-client";
import { validateKey } from "@/lib/utils";

export const GET = withS3(async (request, { client, bucketName }) => {
  const key = request.nextUrl.searchParams.get("key");
  if (!key || !validateKey(key)) {
    return NextResponse.json(
      { error: "Invalid key or path traversal attempt" },
      { status: 400 },
    );
  }

  const url = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucketName, Key: key }),
    { expiresIn: 3600 },
  );

  return NextResponse.json({ url });
});
