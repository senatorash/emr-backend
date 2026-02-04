import Appointment from "../models/appointmentModel";

export const isDoctorAvailable = async (
  doctorId: string,
  scheduledAt: Date,
  duration: number,
): Promise<boolean> => {
  const start = new Date(scheduledAt);
  const end = new Date(start.getTime() + duration * 60000);

  const conflictingAppointments = await Appointment.findOne({
    doctorId,
    status: { $in: ["scheduled"] },

    $expr: {
      $and: [
        { $lt: ["$scheduledAt", end] },
        {
          $gt: [
            { $add: ["$scheduledAt", { $multiply: ["$duration", 60000] }] },
            start,
          ],
        },
      ],
    },
  });
  return !conflictingAppointments;
};
