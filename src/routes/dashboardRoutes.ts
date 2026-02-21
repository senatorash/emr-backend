import { Router } from "express";
import {
  getDashboard,
  getStaffStats,
} from "../controllers/dashboardController";
import { requireSignin } from "../middleware/auth/requireSignin";
import { authorizeSuperAdmin } from "../middleware/auth/requireSuperAdmin";

const dashboardRouter = Router();

dashboardRouter.get("/stats", requireSignin, getDashboard);
dashboardRouter.get(
  "/staff-stats",
  requireSignin,
  authorizeSuperAdmin,
  getStaffStats,
);

export default dashboardRouter;
