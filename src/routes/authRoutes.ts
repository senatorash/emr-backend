import express from "express";
import {
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
} from "../controllers/authController";
import { requireSignin } from "../middleware/auth/requireSignin";
import { validateLogin } from "../middleware/validator/authValidator";
import { checkValidationErrors } from "../middleware/validator/validate";

const authRoutes = express.Router();

authRoutes.post("/login", validateLogin(), checkValidationErrors, loginUser);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.get("/current-user", requireSignin, getCurrentUser);
authRoutes.post("/logout", logoutUser);

export default authRoutes;
