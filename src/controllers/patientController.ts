import { Request, Response } from "express";
import Patient from "../models/patientModel";
import { getPagination } from "../helpers/paginationHelper";

export const createPatient = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      dob,
      gender,
      phone,
      nin,
      address,
      emergencyContact,
      nextOfKin,
      bloodGroup,
    } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!["nurse", "doctor", "super_admin"].includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Only nurses,doctors and super admins can create patient accounts",
      });
    }

    const patientExists = await Patient.findOne({ phone });

    if (patientExists) {
      return res
        .status(409)
        .json({ message: "Patient with this phone number already exists" });
    }

    const newPatient = new Patient({
      fullName,
      dob,
      gender,
      phone,
      nin,
      address,
      emergencyContact,
      nextOfKin,
      bloodGroup,
    });
    await newPatient.save();

    return res.status(201).json({
      message: "Patient account created successfully",
      data: newPatient,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all patients with pagination
export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const { skip, limit } = getPagination(req.query);
    const page = req.query.page ? Number(req.query.page) : 1;
    const patients = await Patient.find().skip(skip).limit(limit);
    const total = await Patient.countDocuments();

    return res.status(200).json({
      message: "Patients retrieved successfully",
      data: patients,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;

    const patientExistsById = await Patient.findOne({ patientId })
      .populate("familyMembers")
      .select("-password");
    if (!patientExistsById) {
      return res.status(404).json({ message: "Patient not found" });
    }
    return res.status(200).json({
      message: "Patient retrieved successfully",
      data: patientExistsById,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const updates = req.body;
    const patient = await Patient.findByIdAndUpdate(patientId, updates, {
      new: true,
      runValidators: true,
    });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findOneAndDelete({ patientId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
