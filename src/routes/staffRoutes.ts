import { Router } from "express";
import { createStaffAccount } from "../controllers/adminController";
import { authorizeAdmin } from "../middleware/auth/requireAdmin";
import { requireSignin } from "../middleware/auth/requireSignin";
import { validateSignup } from "../middleware/validator/staffValidator";
import { checkValidationErrors } from "../middleware/validator/validate";
import { getAllStaff } from "../controllers/adminController";
import { hospitalFiltering } from "../middleware/tenant";

const staffRouter = Router();

staffRouter.post(
  "/create-staff",
  requireSignin,
  authorizeAdmin,
  validateSignup(),
  checkValidationErrors,
  createStaffAccount,
);
staffRouter.get(
  "/all",
  requireSignin,
  authorizeAdmin,
  hospitalFiltering,
  getAllStaff,
);

export default staffRouter;
