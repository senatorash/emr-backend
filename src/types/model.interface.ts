import mongoose from "mongoose";
export interface Ifamily extends mongoose.Document {
  patientId: string;
  patient: mongoose.Types.ObjectId;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  dob: Date;
  relationship: string;
  gender: string;
  familyMemberId?: string;
  hospital: mongoose.Types.ObjectId;
}

export interface Ipatient extends mongoose.Document {
  patientId?: string;
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  phone: string;
  email?: string;
  address: string;
  emergencyContact: string;
  nextOfKin: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  nin: string;
  hospital: mongoose.Types.ObjectId;
  familyMembers: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  status?: "active" | "inactive" | "discharged" | "deceased";
}

export interface Attachments {
  fileName: string;
  fileUrl: string;
  fileType: string;
  category: string;
  uploadedBy: mongoose.Types.ObjectId;
  notes: String;
  uploadedAt: Date;
}

export interface Irecord extends mongoose.Document {
  patientId: string;
  personId: string;
  personModel: "Patient" | "FamilyMember";
  vitals: {
    bloodPressure?: string;
    pulse?: string;
    temperature?: string;
    weight?: string;
    height?: string;
    oxygen?: string;
  };
  recordType:
    | "consultation"
    | "lab_result"
    | "imaging"
    | "prescription"
    | "note"
    | "procedure"
    | "other";
  status: "complete" | "pending" | "reviewed";
  complaints?: string;
  diagnosis?: string;
  treatments?: string;
  CreatedBy: mongoose.Types.ObjectId;
  hospital: mongoose.Types.ObjectId;
  date: Date;
  attachments?: Attachments[];
}

export interface Iuser extends mongoose.Document {
  role: "super_admin" | "admin" | "nurse" | "doctor";
  hospital: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Isession extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  hospital: mongoose.Types.ObjectId;
  token: string;
  deviceInfo?: string;
  ipAddress?: string;
  lastUsedAt?: Date;
  expiresAt?: Date;
}

export interface Iappointment extends mongoose.Document {
  appointmentId: string;
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  hospital: mongoose.Types.ObjectId;
  scheduledAt: Date;
  duration: Number;
  status: "scheduled" | "completed" | "canceled" | "no-show";
  reason?: string;
}

export interface Ihospital extends mongoose.Document {
  name: string;
  phone: string;
  email: string;
  hospitalType: string;
  status: "draft" | "active" | "suspended";
  city: string;
  country: string;
  createdBy: mongoose.Types.ObjectId;
}
