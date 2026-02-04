import { body } from "express-validator";

export const validateSignup = () => {
  return [
    body("fullName")
      .notEmpty()
      .withMessage("Full Name is required")
      .trim()
      .escape(),
    // role
    body("role").notEmpty().withMessage("Role is required").trim().escape(),
    // email
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email Address")
      .normalizeEmail()
      .escape(),
    // password
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character")
      .trim()
      .escape(),
    // confirm password
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm Password is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password does not match");
        }
        return true;
      })
      .trim()
      .escape(),
  ];
};
