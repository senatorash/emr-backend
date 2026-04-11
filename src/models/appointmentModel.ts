import mongoose from "mongoose";
import { Iappointment } from "../types/model.interface";

const Schema = mongoose.Schema;

const appointmentSchema = new Schema<Iappointment>(
  {
    appointmentId: { type: String },
    patient: { type: Schema.Types.ObjectId, ref: "Patient" },
    doctor: { type: Schema.Types.ObjectId, ref: "User" },
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital" },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: {
      type: String,
      enum: ["scheduled", "completed", "canceled", "no-show"],
      default: "scheduled",
    },
    reason: { type: String },
  },
  { timestamps: true },
);

const Appointment = mongoose.model<Iappointment>(
  "Appointment",
  appointmentSchema,
);
export default Appointment;
