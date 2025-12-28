import express from "express";
import { createRecord } from "../controllers/recordController";
import { requireSignin } from "../middleware/auth/requireSignin";

const recordRouter = express.Router();

recordRouter.post("/create", requireSignin, createRecord);
export default recordRouter;
