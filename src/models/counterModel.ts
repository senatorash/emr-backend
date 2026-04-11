import mongoose from "mongoose";

const Schema = mongoose.Schema;

const counterSchema = new Schema({
  identifier: { type: String, required: true },
  seq: { type: Number, default: 0 },
  hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },
});

export const Counter = mongoose.model("Counter", counterSchema);
