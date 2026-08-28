import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { withS3 } from "@/lib/s3-client";
import { validateKey } from "@/lib/utils";

export const DELETE = withS3(async (request, { client, bucketName, userId }) => {
  const key = request.nextUrl.searchParams.get("key");
  if (!key || !validateKey(key)) {
    return NextResponse.json(
      { error: "Invalid key or path traversal attempt" },
      { status: 400 },
    );
  }

  try {
    await client.send(
      new DeleteObjectCommand({ Bucket: bucketName, Key: key }),
    );
    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete operation failed for user:", userId, error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 },
    );
  }
});
