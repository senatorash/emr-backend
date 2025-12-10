import mongoose from "mongoose";
import envVariables from "../config/index";

const { DB_URI } = envVariables;

const connectDB = async () => {
  if (!DB_URI) {
    console.error("Database URI is not defined in environment variables");
    return;
  }
  await mongoose
    .connect(DB_URI)
    .then(() => console.log("database is connected"))
    .catch((error) => console.error("Database connection failed"));
};

export default connectDB;
