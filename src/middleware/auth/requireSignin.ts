import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../helpers/jwtHelpers";
import envVariables from "../../config/index";
import { userPayload } from "../../interfaces/userPayload";

const { JWT_SECRET } = envVariables;

export const requireSignin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const decodedUser = verifyToken(token, JWT_SECRET) as userPayload;
    if (!decodedUser) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decodedUser;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
