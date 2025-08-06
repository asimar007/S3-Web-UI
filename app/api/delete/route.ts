import { NextResponse, NextRequest } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getUserS3Client } from "@/lib/s3-client";

export async function DELETE(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Key is required" }, { status: 400 });
  }

  const s3Config = await getUserS3Client();
  if (!s3Config) {
    return NextResponse.json(
      { error: "No S3 credentials found" },
      { status: 404 }
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
      message: `File deleted: ${key}`,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
