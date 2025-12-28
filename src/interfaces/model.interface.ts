import mongoose from "mongoose";
export interface Ifamily extends mongoose.Document {
  patientId: string;
  phoneNumber: string;
  fullName: string;
  dob: Date;
  relationship: string;
  gender: string;
  familyMemberId?: string;
}

export interface Ipatient extends mongoose.Document {
  patientId?: string;
  fullName: string;
  dob: Date;
  gender: string;
  phone: string;
  address: string;
  emergencyContact: string;
  nextOfKin: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  nin: string;
  familyMembers: mongoose.Types.ObjectId[];
}

export interface Irecord extends mongoose.Document {
  patientId: string;
  personId: string;
  vitals: {
    bloodPressure?: string;
    pulse?: number;
    temperature?: number;
  };
  complaints?: string;
  diagnosis?: string;
  treatment?: string;
  CreatedBy?: string;
  date: Date;
}

export interface Iuser extends mongoose.Document {
  role: "super_admin" | "nurse" | "doctor";
  fullName: string;
  email: string;
  password: string;
}
