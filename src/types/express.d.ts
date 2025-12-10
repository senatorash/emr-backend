import { userPayload } from "../interfaces/userPayload";

declare global {
  namespace Express {
    interface Request {
      user?: userPayload;
    }
  }
}

export {};
