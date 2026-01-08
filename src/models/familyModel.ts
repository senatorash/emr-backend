import mongoose from "mongoose";
import { Ifamily } from "../interfaces/model.interface";

const Schema = mongoose.Schema;

const familySchema = new Schema<Ifamily>(
  {
    // family fields
    patientId: {
      type: String,
      required: true,
    },

    familyMemberId: {
      type: String,
      unique: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    fullName: {
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
  },
  { timestamps: true }
);

const FamilyMember = mongoose.model<Ifamily>("FamilyMember", familySchema);
export default FamilyMember;
