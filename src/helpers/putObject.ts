import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "./s3-credentials";
import { AWS_BUCKET_NAME, AWS_REGION } from "../config/index";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const putObject = async (
  file: { buffer: Buffer; mimetype?: string },
  fileName: string,
) => {
  try {
    const ext = path.extname(fileName).toLowerCase();
    const key = `file-uploads/${uuidv4()}${ext}`;

    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || "application/octet-stream",
    };

    const command = new PutObjectCommand(params);
    const data = await s3client.send(command);
    console.log(data);

    if (data.$metadata.httpStatusCode !== 200) {
      return;
    }
    let url = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${params.Key}`;
    console.log(url);
    return { url, key: params.Key };
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
