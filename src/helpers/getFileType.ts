export const getFileType = async (mimetype?: string) => {
  console.log("MIME type:", mimetype);
  if (!mimetype) return "OTHER";

  const mime = mimetype.toLowerCase();

  if (mime === "application/pdf") return "PDF";
  if (mime === "image/png") return "PNG";
  if (mime === "image/jpeg") return "JPEG";
  if (
    mime === "application/msword" ||
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "WORD";
  }
  if (mime.includes("dicom")) return "DICOM";

  return "OTHER";
};
