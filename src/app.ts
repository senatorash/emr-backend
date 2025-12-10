import express, { Request, Response } from "express";
import adminRouter from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the EMR system API" });
});

app.use("/admin", adminRouter);
app.use("/auth", authRoutes);

export default app;
