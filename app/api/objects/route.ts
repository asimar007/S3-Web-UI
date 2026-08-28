import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { withS3 } from "@/lib/s3-client";

export const GET = withS3(async (request, { client, bucketName }) => {
  const prefix = request.nextUrl.searchParams.get("prefix") ?? undefined;

  const result = await client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
      Delimiter: "/",
      Prefix: prefix,
    }),
  );

  return NextResponse.json({
    files: result.Contents?.map((e) => ({
      Key: e.Key,
      Size: e.Size,
      LastModified: e.LastModified,
    })),
    folders: result.CommonPrefixes?.map((e) => e.Prefix) || [],
  });
});
