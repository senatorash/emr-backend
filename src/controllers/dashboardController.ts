import { Request, Response } from "express";
import {
  getDashboardStats,
  getRecordStats,
} from "../services/dashboardService";
import { getStaff } from "../services/dashboardService";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.userId;
    const hospitalFilter = req.hospitalFilter;

    const stats = await getDashboardStats(userId!, role!, hospitalFilter);
    if (!stats) {
      return res.status(404).json({ message: "No stats found for this user" });
    }
    return res.status(200).json({ success: true, role, data: stats });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStaffStats = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const hospitalFilter = req.hospitalFilter;

    const stats = await getStaff(role!, hospitalFilter!);
    if (!stats) {
      return res.status(404).json({ message: "No staff stats found" });
    }
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const recordStats = async (req: Request, res: Response) => {
  try {
    const hospitalFilter = req.hospitalFilter;

    const stats = await getRecordStats(hospitalFilter);
    if (!stats)
      return res.status(404).json({ message: "No record stats found" });

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {}
};
