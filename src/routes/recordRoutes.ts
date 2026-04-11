import express, { Request, Response } from "express";
import { createRecord, getRecords } from "../controllers/recordController";
import { requireSignin } from "../middleware/auth/requireSignin";
import { hospitalFiltering } from "../middleware/tenant";
import { uploadMiddleware } from "../middleware/Upload/fileUpload";

const recordRouter = express.Router();
recordRouter.post(
  "/create",
  requireSignin,
  hospitalFiltering,
  (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message, error: err });
      }
      next();
    });
  },
  createRecord,
);
recordRouter.get("/all", requireSignin, hospitalFiltering, getRecords);
export default recordRouter;
