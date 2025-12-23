import { Request, Response, NextFunction } from "express";
import { body, validationResult, check } from "express-validator";

const validateLogin = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email Address")
      .normalizeEmail()
      .escape(),

    body("password").notEmpty().withMessage("Password is required").trim(),
  ];
};
