import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/userModel";
import envVariables from "../config/index";

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
      fullName: "Super Admin",
      email: SUPER_ADMIN_EMAIL,
      password: hashedPassword,
    });

    await superAdmin.save();

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
    const { role, fullName, email, password } = req.body;

    if (req.user?.role !== "super_admin") {
      return res.status(403).json({
        Message: "Only super administrators can create staff accounts",
      });
    }

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
      fullName,
      email,
      password: hashedPassword,
    });
    await newStaff.save();

    return res.status(201).json({
      message: `${role}-${fullName} account created successfully`,
      data: newStaff,
    });
  } catch (error) {
    console.error("Error creating staff account:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
