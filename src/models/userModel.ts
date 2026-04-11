import mongoose from "mongoose";
import { Iuser } from "../types/model.interface";

const Schema = mongoose.Schema;

const userSchema = new Schema<Iuser>(
  // user fields
  {
    role: {
      type: String,
      enum: ["super_admin", "admin", "nurse", "doctor"],
      required: true,
    },
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital" },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
const User = mongoose.model<Iuser>("User", userSchema);
export default User;
