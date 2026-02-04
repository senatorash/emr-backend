import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import apiV1Router from "./routes/apiV1";

const app = express();
// global middleware configuration to receive JSON data from client side
app.use(express.json());

// global middleware to parse cookies
app.use(cookieParser());

// global middleware for cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the EMR system API" });
});

app.use("/api/v1", apiV1Router);

export default app;
