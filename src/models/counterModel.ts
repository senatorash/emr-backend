import mongoose from "mongoose";

const Schema = mongoose.Schema;

const counterSchema = new Schema({
  identifier: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export const Counter = mongoose.model("Counter", counterSchema);
