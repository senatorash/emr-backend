import mongoose from "mongoose";
import { Ihospital } from "../types/model.interface";

const Schema = mongoose.Schema;

export const hospitalSchema = new Schema<Ihospital>(
  {
    name: {
      type: String,
      required: true,
    },
    hospitalType: {
      type: String,
      required: true,
      enum: [
        "general hospital",
        "specialized clinic",
        "teaching hospital",
        "community health center",
      ],
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    // status: {
    //   type: String,
    //   enum: ["draft", "active", "suspended"],
    //   default: "draft",
    // },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Hospital = mongoose.model<Ihospital>("Hospital", hospitalSchema);
export default Hospital;
