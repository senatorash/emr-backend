import { Router } from "express";
import { createStaffAccount } from "../controllers/adminController";
import { authorizeSuperAdmin } from "../middleware/auth/requireSuperAdmin";
import { requireSignin } from "../middleware/auth/requireSignin";
import { validateSignup } from "../middleware/validator/staffValidator";
import { checkValidationErrors } from "../middleware/validator/validate";

const staffRouter = Router();

staffRouter.post(
  "/create-staff",
  requireSignin,
  authorizeSuperAdmin,
  validateSignup(),
  checkValidationErrors,
  createStaffAccount,
);

export default staffRouter;
