import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import patientRouter from "./routes/patientRoutes";
import familyRouter from "./routes/familyRoutes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the EMR system API" });
});

app.use("/admin", adminRouter);
app.use("/auth", authRoutes);
app.use("/patients", patientRouter);
app.use("/family", familyRouter);

export default app;
