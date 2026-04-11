import { Request, Response, NextFunction } from "express";

export const hospitalFiltering = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hospitalId = req.user?.hospital;
    const userRole = req.user?.role;
    if (userRole === "super_admin") {
      return next();
    }
    if (!hospitalId) {
      return res
        .status(403)
        .json({ message: "Access denied. Hospital affiliation required." });
    }

    req.hospitalFilter = { hospital: hospitalId };
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
