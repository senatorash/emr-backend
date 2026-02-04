import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const checkValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      method: req.method,
      status: res.statusCode,
      errors: errors.array().map((err) => err.msg),
    });
  }
  next();
};
