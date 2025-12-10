import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { userPayload } from "../interfaces/userPayload";

export const generateToken = (
  payLoad: userPayload,
  expiresIn: SignOptions["expiresIn"],
  secret: Secret
): string => {
  return jwt.sign(payLoad, secret, { expiresIn });
};

export const verifyToken = <T>(token: string, secret: Secret): T => {
  return jwt.verify(token, secret) as T;
};
