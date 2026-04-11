import mongoose from "mongoose";
import { Ifamily } from "../types/model.interface";

const Schema = mongoose.Schema;

const familySchema = new Schema<Ifamily>(
  {
    // family fields
    patientId: {
      type: String,
      required: true,
    },

    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    familyMemberId: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
  },
  { timestamps: true },
);

const FamilyMember = mongoose.model<Ifamily>("FamilyMember", familySchema);
export default FamilyMember;
