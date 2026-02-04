import { body } from "express-validator";

export const validateLogin = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email Address")
      .normalizeEmail()
      .escape(),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .trim()
      .escape(),
  ];
};
