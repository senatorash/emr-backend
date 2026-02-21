import { Counter } from "../models/counterModel";

export const generateId = async (prefix: string) => {
  const year = new Date().getFullYear();

  const counterKey = `${prefix}_${year}`;

  const counter = await Counter.findOneAndUpdate(
    { identifier: counterKey },
    {
      $inc: { seq: 1 },
    },
    { upsert: true, new: true },
  );

  const serial = String(counter.seq).padStart(5, "0");

  return `${prefix}-${year}-${serial}`;
};
