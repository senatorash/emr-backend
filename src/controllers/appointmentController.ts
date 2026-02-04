import { Request, Response } from "express";
import { isDoctorAvailable } from "../helpers/appointmentHelper";
import Appointment from "../models/appointmentModel";
import Patient from "../models/patientModel";

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { patientId, scheduledAt, duration } = req.body;

    const doctorId = req.user?.userId;

    if (!doctorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user?.role !== "doctor") {
      return res
        .status(403)
        .json({ message: "Only doctors can create appointments" });
    }

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return res
        .status(400)
        .json({ message: "scheduledAt must be a valid ISO date-time string" });
    }

    const patientExist = await Patient.findOne({ patientId });

    if (!patientExist) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const available = await isDoctorAvailable(
      doctorId,
      scheduledDate,
      duration,
    );

    if (!available) {
      return res
        .status(409)
        .json({ message: "Doctor is not available at the selected time" });
    }
    const appointment = await Appointment.create({
      patientId: patientExist._id,
      doctorId,
      scheduledAt: scheduledDate,
      duration,
    });
    return res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAppointmentsByPatient = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;

    const appointmentExist = await Appointment.find({ patientId })
      .populate("patientId", "patientId fullName phone")
      .sort({ scheduledAt: -1 })
      .select("-doctorId");
    if (!appointmentExist) {
      return res
        .status(404)
        .json({ message: "Patient appointments not found" });
    }
    return res.status(200).json({ appointmentExist });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAppointmentByDoctor = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;
    const appointmentExist = await Appointment.find({ doctorId })
      .populate("doctorId patientId", "patientId fullName email")
      .sort({
        scheduledAt: -1,
      });
    if (!appointmentExist) {
      return res.status(404).json({ message: "Doctor appointments not found" });
    }
    return res.status(200).json({ appointmentExist });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAppointmentByDate = async (req: Request, res: Response) => {
  try {
    const { date, timezoneOffset } = req.query;

    if (!date || typeof date !== "string") {
      return res.status(400).json({ message: "Date is required (YYYY-MM-DD)" });
    }

    // Adjust the date based on the timezone offset
    const offset = Number(timezoneOffset);
    if (isNaN(offset)) {
      return res.status(400).json({ message: "Invalid timezone offset" });
    }
    // get local start and end of the day
    const localstart = new Date(`${date}T00:00:00`);
    const localEnd = new Date(`${date}T23:59:59.999`);

    // convert local start/end of day
    const utcStart = new Date(localstart.getTime() - offset * 60 * 1000);
    const utcEnd = new Date(localEnd.getTime() - offset * 60 * 1000);

    const appointmentExist = await Appointment.find({
      scheduledAt: { $gte: utcStart, $lte: utcEnd },
    })
      .populate("patientId doctorId", "patientId fullName email")
      .sort({ scheduledAt: 1 });

    if (!appointmentExist) {
      return res.status(404).json({ message: "No appointments found" });
    }
    return res.status(200).json({ appointmentExist });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const rescheduleAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { scheduledAt, duration } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const available = await isDoctorAvailable(
      appointment.doctorId.toString(),
      new Date(scheduledAt),
      duration ?? appointment.duration,
    );

    if (!available) {
      return res
        .status(409)
        .json({ message: "Doctor is not available at the selected time" });
    }

    appointment.scheduledAt = new Date(scheduledAt);
    appointment.duration = duration ?? appointment.duration;
    appointment.status = "scheduled";

    await appointment.save();

    return res
      .status(200)
      .json({ message: "Appointment rescheduled successfully", appointment });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "cancelled" },
      { new: true },
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    return res
      .status(200)
      .json({ message: "Appointment cancelled successfully", appointment });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const completeAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "completed" },
      { new: true },
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    return res
      .status(200)
      .json({ message: "Appointment completed successfully", appointment });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    return res
      .status(200)
      .json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: " Internal Server Error" });
  }
};
