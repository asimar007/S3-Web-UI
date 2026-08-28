import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { withS3 } from "@/lib/s3-client";
import { validateKey } from "@/lib/utils";

export const GET = withS3(async (request, { client, bucketName, userId }) => {
  const key = request.nextUrl.searchParams.get("key");
  if (!key || !validateKey(key)) {
    return NextResponse.json(
      { error: "Invalid key or path traversal attempt" },
      { status: 400 },
    );
  }

  try {
    const response = await client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: key }),
    );

    if (!response.Body) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bytes = await (response.Body as any).transformToByteArray();
    const filename = key.split("/").pop() || "download";

    const headers: Record<string, string> = {
      "Content-Type": response.ContentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    };
    if (response.ContentLength) {
      headers["Content-Length"] = response.ContentLength.toString();
    }

    return new NextResponse(bytes, { headers });
  } catch (error) {
    console.error("Download operation failed for user:", userId, error);
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 },
    );
  }
});
