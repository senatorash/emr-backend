import express from "express";
import { addFamilyMember } from "../controllers/familyController";
import { requireSignin } from "../middleware/auth/requireSignin";

const familyRouter = express.Router();

familyRouter.post("/add", requireSignin, addFamilyMember);

export default familyRouter;
