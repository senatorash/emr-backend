import { Request, Response } from "express";
import Patient from "../models/patientModel";
import FamilyMember from "../models/familyModel";
import { Counter } from "../models/counterModel";

export const addFamilyMember = async (req: Request, res: Response) => {
  try {
    const {
      patientId,
      phoneNumber,
      firstName,
      lastName,
      dob,
      relationship,
      gender,
    } = req.body;

    // comfirm if the patient exists with the given patientId

    const [patient, familyMemberExists] = await Promise.all([
      Patient.findOne({
        patientId,
        hospital: req.hospitalFilter.hospital,
      }),
      FamilyMember.findOne({
        phoneNumber,
        hospital: req.hospitalFilter.hospital,
      }),
    ]);

    if (!patient) {
      return res.status(404).json({
        message: "We can't add a family member for a non-existent patient",
      });
    }

    if (familyMemberExists) {
      return res
        .status(400)
        .json({ message: "This family member already exists" });
    }

    const counterKey = `family_${patient.patientId}`;
    const counter = await Counter.findOneAndUpdate(
      { identifier: counterKey, hospital: req.hospitalFilter.hospital },
      {
        $inc: { seq: 1 },
      },
      { upsert: true, new: true },
    );

    // must not exceed 4 family members
    if (counter.seq > 4) {
      // decrement the counter to remain at 4 since we are not adding the family member
      await Counter.updateOne(
        { identifier: counterKey, hospital: req.hospitalFilter.hospital },
        { $inc: { seq: -1 } },
      );
      return res.status(400).json({
        message: "Cannot add more than 4 family members for a patient",
      });
    }

    // converting the number of count to a letter
    const letter = String.fromCharCode(65 + counter.seq - 1);

    // Generate unique familyMemberId
    const familyMemberId = `${patient.patientId}-${letter}`;

    // Create a family member
    await FamilyMember.create({
      patientId,
      patient: patient._id,
      phoneNumber,
      firstName,
      lastName,
      dob,
      relationship,
      gender,
      familyMemberId,
      hospital: req.hospitalFilter.hospital,
    });

    res
      .status(201)
      .json({ message: "Family member added successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
