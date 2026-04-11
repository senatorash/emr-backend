import { fileTypeFromBuffer } from "file-type";
import path from "path";

export const validateFile = async (file: Express.Multer.File) => {
  console.log(file);
  const ext = path.extname(file.originalname).toLowerCase();

  const allowedExt = [".png", ".jpg", ".jpeg", ".pdf", ".doc", ".docx", ".dcm"];

  if (!allowedExt.includes(ext)) {
    throw new Error(`Invalid file extension: ${ext}`);
  }

  if (ext === ".dcm") {
    // const marker = file.buffer.slice(128, 132).toString();
    // if (marker !== "DICM") {
    //   throw new Error("Invalid DICOM file");
    // }

    return;
  }

  const type = await fileTypeFromBuffer(file.buffer);

  if (!type) {
    throw new Error("Unable to detect file type");
  }

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/dicom",
  ];

  if (!allowedMimeTypes.includes(type.mime)) {
    throw new Error(`Invalid file content type: ${type.mime}`);
  }
};
