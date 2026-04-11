import { Request, Response } from "express";
import Patient from "../models/patientModel";
import FamilyMember from "../models/familyModel";
import Record from "../models/recordModel";
import { uploadAttachment } from "../services/uploadService";
import { Attachments } from "../types/model.interface";
import { getPagination } from "../helpers/paginationHelper";

export const createRecord = async (req: Request, res: Response) => {
  try {
    const {
      patientId,
      personId,
      personModel,
      vitals,
      complaints,
      diagnosis,
      treatments,
    } = req.body;

    // confirm patient exists
    let person;

    if (personModel === "patient") {
      person = await Patient.findOne({
        patientId,
        hospital: req.hospitalFilter.hospital,
      });
    }

    if (personModel === "family") {
      person = await FamilyMember.findOne({
        familyMemberId: personId,
        hospital: req.hospitalFilter.hospital,
      });
    }

    if (!person) {
      return res.status(404).json({ message: "Person with this ID not found" });
    }

    let attachments: Attachments[] = [];
    if (req.files && Array.isArray(req.files)) {
      const metadata = JSON.parse(req.body.metadata || "[]");

      const uploadedFiles = (req.files as Express.Multer.File[]).map(
        (file, index) =>
          uploadAttachment(file, req.user!.userId, {
            category: metadata[index]?.category,
            notes: metadata[index]?.notes,
          }),
      );
      attachments = await Promise.all(uploadedFiles);
    }

    await Record.create({
      patientId,
      personId,
      personModel,
      vitals,
      complaints,
      diagnosis,
      treatments,
      CreatedBy: req.user?.userId,
      hospital: req.hospitalFilter.hospital,
      attachments,
    });

    return res
      .status(201)
      .json({ message: "Medical record created successfully", sucess: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRecords = async (req: Request, res: Response) => {
  try {
    const { skip, limit } = getPagination(req.query);
    const page = req.query.age ? Number(req.query.page) : 1;
    const searchParam = req.query.search as string;

    const hospitalFilter = req.hospitalFilter;

    const search =
      typeof searchParam === "string"
        ? searchParam
        : Array.isArray(searchParam)
          ? searchParam[0]
          : "";

    // filter records by patients, complaints, diagnosis or treatment
    const query = search
      ? {
          $or: [
            { patientId: { $regex: search, $options: "i" } },
            { complaints: { $regex: search, $options: "i" } },
            { diagnosis: { $regex: search, $options: "i" } },
            { treatment: { $regex: search, $options: "i" } },
          ],
          ...hospitalFilter,
        }
      : { ...hospitalFilter };

    const [records, total] = await Promise.all([
      Record.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("CreatedBy", "firstName lastName email"),
      Record.countDocuments(query),
    ]);

    return res.status(200).json({
      message: "Records retrieved successfully",
      data: records,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
