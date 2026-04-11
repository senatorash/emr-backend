export interface EnvVariables {
  PORT: number;
  DB_URI: string;
  SUPER_ADMIN_PASS: string;
  SUPER_ADMIN_EMAIL: string;
  ACCESS_TOKEN_EXPIRES_IN: number;
  REFRESH_TOKEN_EXPIRES_IN: number;
  JWT_SECRET: string;
  CLOUD_NAME: string;
  CLOUD_API_KEY: string;
  CLOUDINARYAPI_SECRET: string;
  AWS_REGION: string;
  AWS_BUCKET_NAME: string;
  AWS_ACCESS_KEY: string;
  AWS_SECRET_KEY: string;
}
