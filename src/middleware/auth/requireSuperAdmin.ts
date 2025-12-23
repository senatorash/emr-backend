import { Request, Response, NextFunction } from "express";
export const authorizeSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "super_admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Super admin only." });
  }
  next();
};
