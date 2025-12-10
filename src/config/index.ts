import dotenv = require("dotenv");
import { EnvVariables } from "../interfaces/env.interface";

dotenv.config();

const envVariables: EnvVariables = {
  PORT: Number(process.env.PORT),
  DB_URI: process.env.DB_URI || "",
  SUPER_ADMIN_PASS: process.env.SUPER_ADMIN_PASS || "",
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL || "",
  ACCESS_TOKEN_EXPIRES_IN: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
  REFRESH_TOKEN_EXPIRES_IN: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
  JWT_SECRET: process.env.JWT_SECRET || "",
};

export = envVariables;
