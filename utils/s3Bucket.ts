import { S3Client } from "@aws-sdk/client-s3";

export const S3_BUCKET_NAME = process.env.BACKBLAZE_BUCKET_NAME;


export const s3 = new S3Client({
  endpoint: process.env.BACKBLAZE_ENDPOINT,
  region: process.env.BACKBLAZE_REGION,
  credentials: {
    accessKeyId: process.env.BACKBLAZE_BUCKET_KEYID || "",
    secretAccessKey: process.env.BACKBLAZE_BUCKET_APPKEY || "",
  },
});
