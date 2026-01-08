import express from "express";
import {
  loginAdmins,
  logoutUser,
  refreshToken,
  getCurrentAdmin,
} from "../controllers/authController";
import { requireSignin } from "../middleware/auth/requireSignin";

const authRoutes = express.Router();

authRoutes.post("/login", loginAdmins);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.get("/current-admin", requireSignin, getCurrentAdmin);
authRoutes.post("/logout", logoutUser);

export default authRoutes;
