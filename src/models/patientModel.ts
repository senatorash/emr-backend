import mongoose from "mongoose";
import { Ipatient } from "../types/model.interface";

const Schema = mongoose.Schema;

const patientSchema = new Schema<Ipatient>(
  {
    // patient fields
    patientId: {
      type: String,
    },
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
    firstName: {
      type: String,
      required: true,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      index: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      index: true,
    },
    nin: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    emergencyContact: {
      type: String,
      required: true,
    },
    nextOfKin: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "discharged", "deceased"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    id: false,
  },
);

patientSchema.virtual("familyMembers", {
  ref: "FamilyMember",
  localField: "_id",
  foreignField: "patient",
});

patientSchema.index({ patientId: 1, hospital: 1 }, { unique: true });

const Patient = mongoose.model<Ipatient>("Patient", patientSchema);
export default Patient;
