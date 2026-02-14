import { NextResponse, NextRequest } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/lib/s3-client";

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
      { status: 400 },
    );
  }

  const s3Config = await getS3Client(request);

  if (!s3Config) {
    return NextResponse.json(
      {
        error: "No S3 credentials found. Please set up your AWS credentials.",
      },
      { status: 404 },
    );
  }

  const { client, bucketName } = s3Config;

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const response = await client.send(command);

    if (!response.Body) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = response.Body as any;
    const bytes = await body.transformToByteArray();
    const filename = key.split("/").pop() || "download";

    const headers: Record<string, string> = {
      "Content-Type": response.ContentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    };

    if (response.ContentLength) {
      headers["Content-Length"] = response.ContentLength.toString();
    }

    return new NextResponse(bytes, {
      headers,
    });
  } catch (error) {
    console.error("Download operation failed for user:", userId);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 },
    );
  }
}
