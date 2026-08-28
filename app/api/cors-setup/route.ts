import { NextResponse } from "next/server";
import { PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { withS3 } from "@/lib/s3-client";

const ALLOWED_ORIGINS = ["http://localhost:3000", "https://s3buddy.vercel.app"];

export const POST = withS3(async (_request, { client, bucketName }) => {
  const corsConfiguration = {
    CORSRules: [
      {
        AllowedHeaders: ["*"],
        AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        AllowedOrigins: ALLOWED_ORIGINS,
        ExposeHeaders: ["ETag"],
        MaxAgeSeconds: 3000,
      },
    ],
  };

  await client.send(
    new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: corsConfiguration,
    }),
  );

  return NextResponse.json({
    success: true,
    message: "CORS configured successfully",
    corsRules: corsConfiguration.CORSRules,
  });
});
