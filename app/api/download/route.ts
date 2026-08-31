import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
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

  // S3 keys may contain quotes, which would break out of the header value.
  const filename = (key.split("/").pop() || "download").replace(/"/g, "");

  const url = await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${filename}"`,
    }),
    { expiresIn: 300 },
  );

  return NextResponse.json({ url });
});
