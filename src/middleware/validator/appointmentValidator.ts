import { body } from "express-validator";

export const validateAppointment = () => {
  return [
    body("patientId")
      .notEmpty()
      .withMessage("Patient ID is required")
      .trim()
      .withMessage("Invalid Patient ID")
      .escape(),

    body("scheduledAt")
      .notEmpty()
      .withMessage("Date and time are required")
      .isISO8601()
      .withMessage("Invalid date format")
      .toDate()
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error("Scheduled date must be in the future");
        }
        return true;
      })
      .escape(),

    body("duration")
      .notEmpty()
      .withMessage("Duration is required")
      .isInt()
      .withMessage("Duration must be an integer")
      .toInt()
      .escape(),
  ];
};

export const rescheduleAppointmentValidator = () => {
  return [
    body("scheduledAt")
      .notEmpty()
      .withMessage("Date and time are required")
      .isISO8601()
      .withMessage("Invalid date format")
      .toDate()
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error("Scheduled date must be in the future");
        }
        return true;
      })
      .escape(),

    body("duration")
      .notEmpty()
      .withMessage("Duration is required")
      .isInt()
      .withMessage("Duration must be an integer")
      .toInt()
      .escape(),
  ];
};
