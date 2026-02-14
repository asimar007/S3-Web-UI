import { NextResponse, NextRequest } from "next/server";
import { PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/lib/s3-client";

import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const s3Config = await getS3Client(request);
  if (!s3Config) {
    return NextResponse.json(
      { error: "No S3 credentials found" },
      { status: 404 },
    );
  }

  const { client, bucketName } = s3Config;

  // Define trusted origins
  const allowedOrigins = [
    "http://localhost:3000",
    "https://www.s3buddy.icu",
    "https://s3buddy.icu",
  ];

  // Deduplicate origins
  const uniqueOrigins = [...new Set(allowedOrigins)];

  const corsConfiguration = {
    CORSRules: [
      {
        AllowedHeaders: ["*"],
        AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        AllowedOrigins: uniqueOrigins,
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
    message: "CORS configured successfully",
    corsRules: corsConfiguration.CORSRules,
  });
}
