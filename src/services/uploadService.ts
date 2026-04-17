import { putObject } from "../helpers/putObject";
import { validateFile } from "../helpers/validateFile";
import { getFileType } from "../helpers/getFileType";
import mongoose from "mongoose";

export const uploadAttachment = async (
  file: Express.Multer.File,
  userId: string,
  meta: {
    category: string;
    notes?: string;
  },
) => {
  await validateFile(file);

  const uploaded = await putObject(file, file.originalname);

  if (!uploaded) {
    throw new Error("Failed to upload file");
  }

  return {
    fileName: file.originalname,
    fileUrl: uploaded.url,
    fileType: await getFileType(file.mimetype),
    category: meta.category,
    notes: meta.notes,
    uploadedBy: new mongoose.Types.ObjectId(userId),
    uploadedAt: new Date(),
  };
};
