import { userPayload } from "./userPayload";
import { Multer } from "multer";

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      files?: Multer.File[]; // For file uploads
      file?: Multer.File; // For single file upload
      hospitalFilter: {
        hospital: string;
      };
      user?: userPayload;
    }
  }
}

export {};
