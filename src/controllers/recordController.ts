import { Request, Response } from "express";
import Patient from "../models/patientModel";
import FamilyMember from "../models/familyModel";
import Record from "../models/recordModel";

export const createRecord = async (req: Request, res: Response) => {
  try {
    const { patientId, personId, vitals, complaints, diagnosis, treatment } =
      req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!["nurse", "doctor", "super_admin"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only nurses and doctors can create medical records",
      });
    }

    // confirm patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res
        .status(404)
        .json({ message: "Patient with this ID not found" });
    }

    // confirm person exists (patient or family member)
    const isPatient = patient?.patientId === personId;

    // check if personId matches family member if not patient
    if (!isPatient) {
      const isFamilyMember = await FamilyMember.findOne({
        familyMemberId: personId,
      });
      if (!isFamilyMember) {
        return res
          .status(404)
          .json({ message: "Family member with this ID not found" });
      }
    }

    const record = await Record.create({
      patientId,
      personId,
      vitals,
      complaints,
      diagnosis,
      treatment,
      CreatedBy: `${req.user?.role} - ${req.user?.fullName}`,
    });
    await record.save();

    return res
      .status(201)
      .json({ message: "Medical record created successfully", record });
  } catch (error) {
    console.error("Error creating medical record:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
