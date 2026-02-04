import mongoose from "mongoose";
import { Iappointment } from "../interfaces/model.interface";

const Schema = mongoose.Schema;

const appointmentSchema = new Schema<Iappointment>(
  {
    appointmentId: { type: String },
    patientId: { type: mongoose.Types.ObjectId, ref: "Patient" },
    doctorId: { type: mongoose.Types.ObjectId, ref: "User" },
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
