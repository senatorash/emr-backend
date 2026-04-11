import dotenv = require("dotenv");
import { EnvVariables } from "../types/env.interface";

dotenv.config();

const envVariables: EnvVariables = {
  PORT: Number(process.env.PORT),
  DB_URI: process.env.DB_URI || "",
  SUPER_ADMIN_PASS: process.env.SUPER_ADMIN_PASS || "",
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL || "",
  ACCESS_TOKEN_EXPIRES_IN: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
  REFRESH_TOKEN_EXPIRES_IN: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
  JWT_SECRET: process.env.JWT_SECRET || "",
  CLOUD_NAME: process.env.CLOUD_NAME || "",
  CLOUD_API_KEY: process.env.CLOUD_API_KEY || "",
  CLOUDINARYAPI_SECRET: process.env.CLOUDINARYAPI_SECRET || "",
  AWS_REGION: process.env.AWS_REGION || "",
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || "",
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || "",
};

export = envVariables;
