import express from "express";
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController";
import { requireSignin } from "../middleware/auth/requireSignin";
import { authorizeAdmin } from "../middleware/auth/requireAdmin";
import { hospitalFiltering } from "../middleware/tenant";

const patientRouter = express.Router();

patientRouter.post("/create", requireSignin, createPatient);
patientRouter.get("/all", requireSignin, hospitalFiltering, getAllPatients);
patientRouter.get(
  "/:patientId",
  requireSignin,
  hospitalFiltering,
  getPatientById,
);
patientRouter.put(
  "/:patientId/update",
  requireSignin,
  hospitalFiltering,
  updatePatient,
);
patientRouter.delete(
  "/:patientId/delete",
  requireSignin,
  authorizeAdmin,
  deletePatient,
);

export default patientRouter;
