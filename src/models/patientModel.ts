import mongoose from "mongoose";
import { Ipatient } from "../interfaces/model.interface";
import { Counter } from "./counterModel";

const Schema = mongoose.Schema;

const patientSchema = new Schema<Ipatient>(
  {
    // patient fields
    patientId: {
      type: String,
      unique: true,
      index: true,
    },
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
    familyMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "FamilyMember",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Patient = mongoose.model<Ipatient>("Patient", patientSchema);
export default Patient;
