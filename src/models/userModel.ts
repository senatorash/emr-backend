import mongoose from "mongoose";
import { Iuser } from "../interfaces/model.interface";

const Schema = mongoose.Schema;

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
