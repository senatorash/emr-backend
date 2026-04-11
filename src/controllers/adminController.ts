import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/userModel";
import envVariables from "../config/index";
import { getPagination } from "../helpers/paginationHelper";

const { SUPER_ADMIN_PASS, SUPER_ADMIN_EMAIL } = envVariables;

export const createSuperAdmin = async (req: Request, res: Response) => {
  try {
    const superAdminExists = await User.findOne({ role: "super_admin" });

    if (superAdminExists) {
      return res.status(409).json({ message: "Super admin already exists" });
    }

    if (!SUPER_ADMIN_PASS || !SUPER_ADMIN_EMAIL) {
      return res.status(500).json({
        message: "Super admin credentials are not set in environment variables",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASS, salt);

    const superAdmin = await User.create({
      role: "super_admin",
      firstName: "Super",
      lastName: "Admin",
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
    });

    if (!superAdmin) {
      return res.status(400).json({ message: "Failed to create super admin" });
    }

    return res.status(201).json({
      message: "Super admin created successfully",
      superAdmin,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const createStaffAccount = async (req: Request, res: Response) => {
  try {
    const { role, firstName, lastName, email, password } = req.body;

    const hospitalId = req.user?.hospital;
    if (!hospitalId)
      return res
        .status(403)
        .json({ message: "Access denied. Hospital affiliation required." });

    if (!["nurse", "doctor"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Only nurse or doctor accounts can be created",
      });
    }
    const staffExists = await User.findOne({ email });
    if (staffExists) {
      return res.status(409).json({ message: "Staff account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStaff = await User.create({
      role,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      hospital: hospitalId,
    });
    await newStaff.save();

    return res.status(201).json({
      message: `${role}-${firstName} account created successfully`,
      success: true,
    });
  } catch (error) {
    console.error("Error creating staff account:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getAllStaff = async (req: Request, res: Response) => {
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

    const roleFilter = {
      role: { $in: ["doctor", "nurse"] },
    };

    // if search query is provided, filter patients by first name, last name or email
    const SearchFilter = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const query = {
      $and: [roleFilter, SearchFilter, req.hospitalFilter],
    };

    const [staff, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      message: "Staff retrieved successfully",
      data: staff,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
