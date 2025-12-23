import express from "express";
import {
  createSuperAdmin,
  createStaffAccount,
} from "../controllers/adminController";
import { authorizeSuperAdmin } from "../middleware/auth/requireSuperAdmin";
import { requireSignin } from "../middleware/auth/requireSignin";

const adminRouter = express.Router();

adminRouter.post("/create-super-admin", createSuperAdmin);
adminRouter.post(
  "/create-staff",
  requireSignin,
  authorizeSuperAdmin,
  createStaffAccount
);
export default adminRouter;
