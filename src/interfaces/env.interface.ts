export interface EnvVariables {
  PORT: number;
  DB_URI: string;
  SUPER_ADMIN_PASS: string;
  SUPER_ADMIN_EMAIL: string;
  ACCESS_TOKEN_EXPIRES_IN: number;
  REFRESH_TOKEN_EXPIRES_IN: number;
  JWT_SECRET: string;
}
