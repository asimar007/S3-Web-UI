import { NextResponse, NextRequest } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getUserS3Client } from "@/lib/s3-client";

export async function GET(request: NextRequest) {
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
  const prefix = request.nextUrl.searchParams.get("prefix") ?? undefined;

  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Delimiter: "/",
    Prefix: prefix,
  });

  const result = await client.send(command);

  //console.log(result);

  const modifiedResponse = result.Contents?.map((e) => ({
    Key: e.Key,
    Size: e.Size,
    LastModified: e.LastModified,
  }));

  const rootFolder = result.CommonPrefixes?.map((e) => e.Prefix) || [];

  return NextResponse.json({ files: modifiedResponse, folders: rootFolder });
}
