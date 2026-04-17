import mongoose from "mongoose";

export interface AttachmentMeta {
  category:
    | "consultation"
    | "lab_result"
    | "imaging"
    | "prescription"
    | "other"
    | "clinical_doc"
    | "admin_doc";
  notes?: string;
}

export interface Attachments {
  fileName: string;
  fileUrl: string;
  fileType: string;
  category: string;
  uploadedBy: mongoose.Types.ObjectId;
  notes?: string;
  uploadedAt: Date;
}
