import express from "express";
import { createSuperAdmin } from "../controllers/adminController";

const adminRouter = express.Router();

adminRouter.post("/create-super-admin", createSuperAdmin);

export default adminRouter;
