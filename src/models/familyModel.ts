import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface Ifamily extends mongoose.Document {
  patientId: string;
  fullName: string;
  dob: Date;
  relationship: string;
  gender: string;
  familyMemberId?: string;
}

const familySchema = new Schema<Ifamily>({
  // family fields
  patientId: {
    type: String,
    required: true,
  },

  familyMemberId: {
    type: String,
    unique: true,
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
});

const FamilyMember = mongoose.model<Ifamily>("FamilyMember", familySchema);
export default FamilyMember;
