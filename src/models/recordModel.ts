import mongoose from "mongoose";
import { Irecord } from "../types/model.interface";

const Schema = mongoose.Schema;

const recordSchema = new Schema<Irecord>(
  {
    // record fields
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    patientId: {
      type: String,
      required: true,
      index: true,
    },
    personId: {
      type: String,
      required: true,
      index: true,
    },
    vitals: {
      bloodPressure: { type: String },
      pulse: { type: String },
      temperature: { type: String },
      weight: { type: String },
      height: { type: String },
      oxygen: { type: String },
    },
    recordType: {
      type: String,
      enum: [
        "consultation",
        "lab_result",
        "imaging",
        "prescription",
        "notes",
        "procedure",
        "other",
      ],
      default: "consultation",
    },
    status: {
      type: String,
      enum: ["complete", "pending", "reviewed"],
      default: "pending",
    },
    complaints: {
      type: String,
    },
    treatments: {
      type: String,
    },
    diagnosis: {
      type: String,
    },
    CreatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    personModel: {
      type: String,
      enum: ["patient", "family"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },

    attachments: [
      {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true }, // cloud/local path
        fileType: {
          type: String,
          enum: ["PDF", "PNG", "JPEG", "JPG", "DICOM", "WORD", "OTHER"],
          required: true,
        },
        category: {
          type: String,
          enum: [
            "lab_result",
            "imaging",
            "prescription",
            "clinical_doc",
            "admin_doc",
            "other",
          ],
          default: "other",
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        notes: { type: String },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

const Record = mongoose.model<Irecord>("Record", recordSchema);
export default Record;
