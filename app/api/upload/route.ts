import { NextResponse, NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) throw new Error("Key is required");

  const command = new PutObjectCommand({
    Bucket: "s3-web-ui-asim",
    Key: key,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return NextResponse.json({ url });
}
