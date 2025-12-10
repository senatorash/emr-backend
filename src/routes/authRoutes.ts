import express from "express";
import { loginAdmins, logoutUser } from "../controllers/authController";

const authRoutes = express.Router();

authRoutes.post("/login", loginAdmins);
authRoutes.post("/logout", logoutUser);

export default authRoutes;
