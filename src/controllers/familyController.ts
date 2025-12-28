import { Request, Response } from "express";
import Patient from "../models/patientModel";
import FamilyMember from "../models/familyModel";

export const addFamilyMember = async (req: Request, res: Response) => {
  try {
    const { patientId, phoneNumber, fullName, dob, relationship, gender } =
      req.body;

    // comfirm if the patient exists with the given patientId
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        message: "We can't add a family member for a non-existent patient",
      });
    }
    const familyMemberExists = await FamilyMember.findOne({
      phoneNumber,
      dob,
    });

    if (familyMemberExists) {
      return res
        .status(400)
        .json({ message: "This family member already exists" });
    }
    // Count existing family members for the patient to easily append a letter to the patient ID
    const familyCount = await FamilyMember.countDocuments({ patientId });

    // must not exceed 8 family members
    if (familyCount >= 8) {
      return res.status(400).json({
        message: "Cannot add more than 8 family members for a patient",
      });
    }

    // converting the number of count to a letter
    const letter = String.fromCharCode(65 + familyCount);

    // Generate unique familyMemberId
    const familyMemberId = `${patient.patientId}-${letter}`;

    // Create and save the new family member
    const newMember = await FamilyMember.create({
      patientId,
      phoneNumber,
      fullName,
      dob,
      relationship,
      gender,
      familyMemberId,
    });
    // Add the new family member to the patient's familyMembers array in the Patient model
    patient.familyMembers.push(newMember._id);
    await newMember.save();
    // Save the updated patient document with the new family member reference
    await patient.save();

    res
      .status(201)
      .json({ message: "Family member added successfully", data: newMember });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
