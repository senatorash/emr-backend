import { Router } from "express";
import { createHospital } from "../controllers/hospitalController";

const hospitalRouter = Router();

hospitalRouter.post("/register", createHospital);

export default hospitalRouter;
