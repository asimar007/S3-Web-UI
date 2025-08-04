import { NextResponse, NextRequest } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
export async function GET(request: NextRequest) {
  const prefix = request.nextUrl.searchParams.get("prefix") ?? undefined;
  const command = new ListObjectsV2Command({
    Bucket: "s3-web-ui-asim",
    Delimiter: "/",
    Prefix: prefix,
  });
  const result = await client.send(command);
  console.log(result);
  const modifiedResponse = result.Contents?.map((e) => ({
    Key: e.Key,
    Size: e.Size,
    LastModified: e.LastModified,
  }));
  const rootFolder = result.CommonPrefixes?.map((e) => e.Prefix) || [];
  return NextResponse.json({ files: modifiedResponse, folders: rootFolder });
}
