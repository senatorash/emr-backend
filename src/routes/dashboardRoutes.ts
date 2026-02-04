import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { requireSignin } from "../middleware/auth/requireSignin";

const dashboardRouter = Router();

dashboardRouter.get("/stats", requireSignin, getDashboardStats);

export default dashboardRouter;
