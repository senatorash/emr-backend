import { Request, Response } from "express";
import Patient from "../models/patientModel";
import FamilyMember from "../models/familyModel";
import Record from "../models/recordModel";
import { uploadAttachment } from "../services/uploadService";
import { Attachments, AttachmentMeta } from "../types/record.interface";
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

    if (personModel === "Patient") {
      person = await Patient.findOne({
        patientId: personId,
        hospital: req.hospitalFilter.hospital,
      });
    }

    if (personModel === "FamilyMember") {
      person = await FamilyMember.findOne({
        familyMemberId: personId,
        hospital: req.hospitalFilter.hospital,
      });
    }

    if (!person) {
      return res
        .status(404)
        .json({
          message:
            "Person with this ID not found. Please check the ID and the associated person model.",
        });
    }

    let attachments: Attachments[] = [];

    if (req.files && Array.isArray(req.files)) {
      let metadata: AttachmentMeta[] = [];
      try {
        metadata = JSON.parse(req.body.metadata || "[]");
      } catch (error) {
        metadata = [];
      }

      const files = req.files as Express.Multer.File[];

      const invalidIndex = files.findIndex(
        (_, index) => !metadata[index]?.category,
      );

      if (invalidIndex !== -1) {
        return res.status(400).json({
          message: `Missing category in metadata for file at index ${invalidIndex}: "${files[invalidIndex].originalname}"`,
        });
      }

      attachments = await Promise.all(
        files.map((file, index) => {
          const { category, notes } = metadata[index];
          return uploadAttachment(file, req.user!.userId, { category, notes });
        }),
      );
    }

    await Record.create({
      patientId,
      personId: person._id,
      personModel,
      vitals,
      complaints,
      diagnosis,
      treatments,
      createdBy: req.user?.userId,
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
        .populate("createdBy", "firstName lastName email")
        .populate("personId", "firstName lastName"),
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
