import { Router } from "express";
import {
  createAppointment,
  getAppointmentByDate,
  getAppointmentByDoctor,
  getAppointmentsByPatient,
  rescheduleAppointment,
  cancelAppointment,
  completeAppointment,
  deleteAppointment,
} from "../controllers/appointmentController";
import { requireSignin } from "../middleware/auth/requireSignin";
import {
  validateAppointment,
  rescheduleAppointmentValidator,
} from "../middleware/validator/appointmentValidator";
import { checkValidationErrors } from "../middleware/validator/validate";

const appointmentRouter = Router();
appointmentRouter.post(
  "/create",
  requireSignin,
  validateAppointment(),
  checkValidationErrors,
  createAppointment,
);
appointmentRouter.get(
  "/patient/:patientId",
  requireSignin,
  getAppointmentsByPatient,
);
appointmentRouter.get(
  "/staff/:doctorId",
  requireSignin,
  getAppointmentByDoctor,
);
appointmentRouter.get("/date", requireSignin, getAppointmentByDate);
appointmentRouter.patch(
  "/:appointmentId/reschedule",
  requireSignin,
  rescheduleAppointmentValidator(),
  checkValidationErrors,
  rescheduleAppointment,
);
appointmentRouter.patch(
  "/:appointmentId/cancel",
  requireSignin,
  cancelAppointment,
);
appointmentRouter.patch(
  "/:appointmentId/complete",
  requireSignin,
  completeAppointment,
);
appointmentRouter.delete(
  "/:appointmentId/delete",
  requireSignin,
  deleteAppointment,
);

export default appointmentRouter;
