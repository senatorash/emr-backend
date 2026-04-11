import express from "express";
import { addFamilyMember } from "../controllers/familyController";
import { requireSignin } from "../middleware/auth/requireSignin";
import { hospitalFiltering } from "../middleware/tenant";

const familyRouter = express.Router();

familyRouter.post("/add", requireSignin, hospitalFiltering, addFamilyMember);

export default familyRouter;
