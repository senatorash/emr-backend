import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface Irecord extends mongoose.Document {
  personId: mongoose.Types.ObjectId;
  vitals: {
    bloodPressure?: string;
    pulse?: number;
    temperature?: number;
  };
  complaints?: string;
  diagnosis?: string;
  treatment?: string;
  UserId?: mongoose.Types.ObjectId;
  date: Date;
}

const recordSchema = new Schema<Irecord>(
  {
    // record fields
    personId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
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
    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
