import { S3Client } from "@aws-sdk/client-s3";
import envVariables from "../config/index";

const { AWS_REGION, AWS_BUCKET_NAME, AWS_ACCESS_KEY, AWS_SECRET_KEY } =
  envVariables;

export const s3client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});
