import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import adminRouter from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import patientRouter from "./routes/patientRoutes";
import familyRouter from "./routes/familyRoutes";
import recordRouter from "./routes/recordRoutes";

const app = express();
// global middleware configuration to receive JSON data from client s
app.use(express.json());

// global middleware to parse cookies
app.use(cookieParser());

// global middleware for cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the EMR system API" });
});

app.use("/admin", adminRouter);
app.use("/auth", authRoutes);
app.use("/patients", patientRouter);
app.use("/family", familyRouter);
app.use("/records", recordRouter);

export default app;
