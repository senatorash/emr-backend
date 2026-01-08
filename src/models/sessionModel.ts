import mongoose from "mongoose";

import { Isession } from "../interfaces/model.interface";

const Schema = mongoose.Schema;

const sessionSchema = new Schema<Isession>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true,
    },
    token: {
      type: String,
      // required: true,
      unique: true,
    },
    deviceInfo: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto cleanup expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model<Isession>("Session", sessionSchema);
export default Session;
