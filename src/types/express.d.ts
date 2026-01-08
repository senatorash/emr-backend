import { userPayload } from "../interfaces/userPayload";

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: userPayload;
    }
  }
}

export {};
