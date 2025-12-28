import mongoose from "mongoose";
import { Ipatient } from "../interfaces/model.interface";

const Schema = mongoose.Schema;

const patientSchema = new Schema<Ipatient>(
  {
    // patient fields
    patientId: {
      type: String,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
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
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    familyMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "FamilyMember",
      },
    ],
  },
  { timestamps: true }
);

// Auto generate parentId before saving a patient
patientSchema.pre("save", async function () {
  if (this.patientId) return;
  const year = new Date().getFullYear();
  const count = await mongoose.model<Ipatient>("Patient").countDocuments();
  const serial = String(count + 1).padStart(4, "0");
  this.patientId = `EMR-${year}-${serial}`;
});

const Patient = mongoose.model<Ipatient>("Patient", patientSchema);
export default Patient;
