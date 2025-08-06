import { NextResponse, NextRequest } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getUserS3Client } from "@/lib/s3-client";

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Key is required" }, { status: 400 });
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

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const response = await client.send(command);

  if (!response.Body) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const bytes = await response.Body.transformToByteArray();
  const filename = key.split("/").pop() || "download";

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": response.ContentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": response.ContentLength?.toString() || "",
    },
  });
}
