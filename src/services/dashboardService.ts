import Patient from "../models/patientModel";
import Record from "../models/recordModel";
import Appointment from "../models/appointmentModel";
import User from "../models/userModel";
import { getDateRanges } from "../helpers/timeHelpers";
import { calculateChangeType } from "../helpers/calculateChangeType";

export const getDashboardStats = async (
  userId: string,
  role: string,
  hospitalFilter: {},
) => {
  try {
    const { startOfToday, endOfToday, startOfMonth, startOfLastMonth } =
      getDateRanges();

    // staff stats
    const [currentStaffCount, lastStaffCount, totalStaff] = await Promise.all([
      User.countDocuments({
        role: { $in: ["doctor", "nurse"] },
        createdAt: { $gte: startOfMonth },
        ...hospitalFilter,
      }),
      User.countDocuments({
        role: { $in: ["doctor", "nurse"] },
        createdAt: {
          $gte: startOfLastMonth,
          $lt: startOfMonth,
        },
        ...hospitalFilter,
      }),
      User.countDocuments({
        role: { $in: ["doctor", "nurse"] },
        ...hospitalFilter,
      }),
    ]);

    // calculate change type for staff(increase,decrease or neutral change in the number of staff compared to last month)
    const staffChange = calculateChangeType(currentStaffCount, lastStaffCount);

    // patient stats
    const [currentPatientsCount, lastPatientsCount, totalPatients] =
      await Promise.all([
        Patient.countDocuments({
          createdAt: { $gte: startOfMonth },
          ...hospitalFilter,
        }),
        Patient.countDocuments({
          createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
          ...hospitalFilter,
        }),
        Patient.countDocuments(hospitalFilter),
      ]);

    // calculate change type for patients(increase,decrease or neutral change in the number of patients compared to last month)
    const patientChange = calculateChangeType(
      currentPatientsCount,
      lastPatientsCount,
    );

    // record stats
    const [
      currentRecordsCount,
      lastRecordsCount,
      totalRecords,
      pendingRecords,
      recordsCreated,
      vitalsToRecord,
    ] = await Promise.all([
      Record.countDocuments({
        createdAt: { $gte: startOfMonth },
        ...hospitalFilter,
      }),
      Record.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
        ...hospitalFilter,
      }),
      Record.countDocuments(hospitalFilter),
      Record.countDocuments({
        createdBy: userId,
        diagnosis: { $exists: false },
        ...hospitalFilter,
      }),
      Record.countDocuments({ createdBy: userId, ...hospitalFilter }),
      Record.countDocuments({ vitals: { $exists: false }, ...hospitalFilter }),
    ]);
    // calculate change type for records(increase,decrease or neutral change in the number of records compared to last month)
    const recordChange = calculateChangeType(
      currentRecordsCount,
      lastRecordsCount,
    );

    // appointment stats for doctor
    const [todaysAppointments, yesterdaysAppointments, totalAppointments] =
      await Promise.all([
        Appointment.countDocuments({
          doctorId: userId,
          scheduledAt: { $gte: startOfToday, $lt: endOfToday },
          ...hospitalFilter,
        }),
        Appointment.countDocuments({
          doctorId: userId,
          scheduledAt: {
            $gte: new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000),
            $lt: startOfToday,
          },
          ...hospitalFilter,
        }),

        Appointment.countDocuments({
          doctorId: userId,
          status: "scheduled",
          scheduledAt: { $gte: new Date() },
          ...hospitalFilter,
        }),
      ]);

    const appointmentChange = calculateChangeType(
      todaysAppointments,
      yesterdaysAppointments,
    );

    // appointment stats for super admin
    const [
      todaysAppointmentsForAdmin,
      yesterdaysAppointmentsForAdmin,
      totalAppointmentsForAdmin,
    ] = await Promise.all([
      Appointment.countDocuments({
        scheduledAt: { $gte: startOfToday, $lt: endOfToday },
        ...hospitalFilter,
      }),
      Appointment.countDocuments({
        scheduledAt: {
          $gte: new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000),
          $lt: startOfToday,
        },
        ...hospitalFilter,
      }),
      Appointment.countDocuments({
        status: "scheduled",
        scheduledAt: { $gte: new Date() },
        ...hospitalFilter,
      }),
    ]);

    const appointmentChangeForAdmin = calculateChangeType(
      todaysAppointmentsForAdmin,
      yesterdaysAppointmentsForAdmin,
    );

    if (role === "admin") {
      const uptimeSeconds = process.uptime();

      const uptimePercentage = Math.min(
        parseFloat(((uptimeSeconds / (60 * 60 * 24 * 30)) * 100).toFixed(2)),
        100,
      );

      const uptimeChangeType =
        Number(uptimePercentage) >= 99
          ? "positive"
          : Number(uptimePercentage) >= 95
            ? "neutral"
            : "negative";

      return {
        stats: [
          {
            title: "Total Staff",
            value: totalStaff,
            change: staffChange.change,
            changeType: staffChange.changeType,
          },
          {
            title: "Total Patients",
            value: totalPatients,
            change: patientChange.change,
            changeType: patientChange.changeType,
          },
          {
            title: "Total Records",
            value: totalRecords,
            change: recordChange.change,
            changeType: recordChange.changeType,
          },
          {
            title: "Today's Appointments",
            value: todaysAppointmentsForAdmin,
            change: appointmentChangeForAdmin.change,
            changeType: appointmentChangeForAdmin.changeType,
          },
          {
            title: "Total Appointments",
            value: totalAppointmentsForAdmin,
            change: "",
            changeType: "neutral",
          },
          {
            title: "System Uptime",
            value: `${uptimePercentage}%`,
            change: uptimePercentage >= 99 ? "Stable" : "Monitoring",
            changeType: uptimeChangeType,
          },
        ],
      };
    }

    // doctor
    if (role === "doctor") {
      return {
        stats: [
          {
            title: "Total Patients",
            value: totalPatients,
            change: patientChange.change,
            changeType: patientChange.changeType,
          },
          {
            title: "Today's Appointments",
            value: todaysAppointments,
            change: appointmentChange.change,
            changeType: appointmentChange.changeType,
          },
          {
            title: "Total Appointments",
            value: totalAppointments,
            change: "",
            changeType: "neutral",
          },
          {
            title: "Pending Records",
            value: pendingRecords,
            change: "",
            changeType: "neutral",
          },
        ],
      };
    }

    // nurse
    if (role === "nurse") {
      return {
        stats: [
          {
            title: "Total Patients",
            value: totalPatients,
            change: patientChange.change,
            changeType: patientChange.changeType,
          },
          {
            title: "Total Records",
            value: totalRecords,
            change: recordChange.change,
            changeType: recordChange.changeType,
          },
          {
            title: "Records Created",
            value: recordsCreated,
            change: "",
            changeType: "neutral",
          },
          {
            title: "Vitals to Record",
            value: vitalsToRecord,
            change: "",
            changeType: "neutral",
          },
        ],
      };
    }

    return { stats: [] };
  } catch (error) {
    throw error;
  }
};

export const getStaff = async (role: string, hospitalFilter: {}) => {
  try {
    const [totalStaff, totalDoctors, totalNurses] = await Promise.all([
      User.countDocuments({
        role: { $in: ["doctor", "nurse"] },
        ...hospitalFilter,
      }),
      User.countDocuments({ role: "doctor", ...hospitalFilter }),
      User.countDocuments({ role: "nurse", ...hospitalFilter }),
    ]);
    return {
      stats: [
        {
          title: "Total Staff",
          value: totalStaff,
        },
        {
          title: "Doctors",
          value: totalDoctors,
        },
        {
          title: "Nurses",
          value: totalNurses,
        },
      ],
    };
  } catch (error) {}
};
