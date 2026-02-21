import { Request, Response } from "express";
import Patient from "../models/patientModel";
import { getPagination } from "../helpers/paginationHelper";
import { generateId } from "../helpers/idGenerator";

// create a new patient
export const createPatient = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      gender,
      phone,
      email,
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

    const patientExists = await Patient.findOne({
      $or: [{ email }, { phone }],
    });

    if (patientExists) {
      if (patientExists.email === email) {
        return res.status(409).json({ message: "Email already in use" });
      }
      if (patientExists.phone === phone) {
        return res.status(409).json({ message: "Phone number already in use" });
      }
    }

    const patientId = await generateId("PAT");

    const newPatient = new Patient({
      firstName,
      lastName,
      dob,
      gender,
      phone,
      email,
      nin,
      address,
      emergencyContact,
      nextOfKin,
      bloodGroup,
      patientId,
      createdBy: req.user.userId,
    });
    await newPatient.save();

    return res.status(201).json({
      message: "Patient account created successfully",
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
    const searchParam = req.query.search as string;

    const search =
      typeof searchParam === "string"
        ? searchParam
        : Array.isArray(searchParam)
          ? searchParam[0]
          : "";

    // if search query is provided, filter patients by first name, last name or email
    const query = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { patientId: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [patients, total] = await Promise.all([
      Patient.find(query).skip(skip).limit(limit),
      Patient.countDocuments(query),
    ]);

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
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get a patient by id
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

// update a patient by id
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

// delete patient from the database
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
