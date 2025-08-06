import { NextResponse, NextRequest } from "next/server";
import { PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { getUserS3Client } from "@/lib/s3-client";

export async function POST(request: NextRequest) {
  const s3Config = await getUserS3Client();
  if (!s3Config) {
    return NextResponse.json(
      { error: "No S3 credentials found" },
      { status: 404 }
    );
  }

  const { client, bucketName } = s3Config;
  const origin = request.headers.get("origin") || "http://localhost:3000";

  const corsConfiguration = {
    CORSRules: [
      {
        AllowedHeaders: ["*"],
        AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        AllowedOrigins: ["http://localhost:3000", origin],
        ExposeHeaders: ["ETag"],
        MaxAgeSeconds: 3000,
      },
    ],
  };

  const command = new PutBucketCorsCommand({
    Bucket: bucketName,
    CORSConfiguration: corsConfiguration,
  });

  await client.send(command);

  return NextResponse.json({
    success: true,
    message: `CORS configured for bucket: ${bucketName}`,
    corsRules: corsConfiguration.CORSRules,
  });
}
