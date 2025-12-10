import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface Iuser extends mongoose.Document {
  role: "super_admin" | "nurse" | "doctor";
  fullName: string;
  email: string;
  password: string;
}

const userSchema = new Schema<Iuser>(
  // user fields
  {
    role: {
      type: String,
      enum: ["super_admin", "nurse", "doctor"],
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);
const User = mongoose.model<Iuser>("User", userSchema);
export default User;
