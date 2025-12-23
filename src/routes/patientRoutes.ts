import express from "express";
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController";
import { requireSignin } from "../middleware/auth/requireSignin";
import { authorizeSuperAdmin } from "../middleware/auth/requireSuperAdmin";

const patientRouter = express.Router();

patientRouter.post("/create", requireSignin, createPatient);
patientRouter.get("/all", requireSignin, getAllPatients);
patientRouter.get("/:patientId", requireSignin, getPatientById);
patientRouter.put("/:patientId/update", requireSignin, updatePatient);
patientRouter.delete(
  "/:patientId/delete",
  requireSignin,
  authorizeSuperAdmin,
  deletePatient
);

export default patientRouter;
