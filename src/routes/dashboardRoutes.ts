import { Router } from "express";
import {
  getDashboard,
  getStaffStats,
  recordStats,
} from "../controllers/dashboardController";
import { requireSignin } from "../middleware/auth/requireSignin";
import { authorizeAdmin } from "../middleware/auth/requireAdmin";
import { hospitalFiltering } from "../middleware/tenant";

const dashboardRouter = Router();

dashboardRouter.get("/stats", requireSignin, hospitalFiltering, getDashboard);
dashboardRouter.get(
  "/staff-stats",
  requireSignin,
  authorizeAdmin,
  hospitalFiltering,
  getStaffStats,
);
dashboardRouter.get(
  "/record-stats",
  requireSignin,
  hospitalFiltering,
  recordStats,
);

export default dashboardRouter;
