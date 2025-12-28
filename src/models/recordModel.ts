import mongoose from "mongoose";
import { Irecord } from "../interfaces/model.interface";

const Schema = mongoose.Schema;

const recordSchema = new Schema<Irecord>(
  {
    // record fields
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
      pulse: { type: Number },
      temperature: { type: Number },
    },
    complaints: {
      type: String,
    },
    treatment: {
      type: String,
    },
    diagnosis: {
      type: String,
    },
    CreatedBy: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Record = mongoose.model<Irecord>("Record", recordSchema);
export default Record;
