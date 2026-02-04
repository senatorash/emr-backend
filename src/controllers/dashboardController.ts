import { Request, Response } from "express";
import User from "../models/userModel";
import Patient from "../models/patientModel";
import Record from "../models/recordModel";
import Appointment from "../models/appointmentModel";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.userId;

    // Super Admin
    if (role === "super_admin") {
      const [staff, patients, records] = await Promise.all([
        User.countDocuments({ role: { $in: ["doctor", "nurse"] } }),
        Patient.countDocuments(),
        Record.countDocuments(),
      ]);

      return res.status(200).json({
        role,
        stats: {
          totalStaff: staff,
          totalPatients: patients,
          totalRecords: records,
          systemUptime: "99.9%",
        },
      });
    }

    // doctor

    if (role === "doctor") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const [appointments, patients, records, todaysAppointments] =
        await Promise.all([
          Appointment.countDocuments({ doctorId: userId }),
          Patient.countDocuments(),
          Record.countDocuments({ createdBy: userId }),
          Appointment.countDocuments({
            doctorId: userId,
            scheduledAt: {
              $gte: startOfDay,
              $lt: endOfDay,
            },
          }),
        ]);

      return res.status(200).json({
        role,
        stats: {
          totalAppointments: appointments,
          totalPatients: patients,
          totalRecords: records,
          todaysAppointments: todaysAppointments,
        },
      });
    }

    // nurse
    if (role === "nurse") {
      const [patients, records] = await Promise.all([
        Patient.countDocuments(),
        Record.countDocuments(),
      ]);
      return res.status(200).json({
        role,
        stats: {
          totalPatients: patients,
          totalRecords: records,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
