import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Hospital from "../models/hospitalModel";
import User from "../models/userModel";

export const createHospital = async (req: Request, res: Response) => {
  const Session = mongoose.startSession();
  const session = await Session;
  try {
    session.startTransaction();

    const {
      hospitalName,
      hospitalType,
      city,
      phone,
      country,
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    const hospitalExists = await Hospital.findOne({
      name: hospitalName,
      city,
      country,
    }).session(session);

    if (hospitalExists)
      return res
        .status(409)
        .json({ message: "Hospital already registered at this location" });

    const [hospital] = await Hospital.create(
      [
        {
          name: hospitalName,
          hospitalType,
          city,
          phone,
          country,
        },
      ],
      { session },
    );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [adminUser] = await User.create(
      [
        {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: "admin",
          hospital: hospital._id,
        },
      ],
      { session },
    );

    hospital.createdBy = adminUser._id;
    await hospital.save();

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Hospital and admin user created successfully",
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating hospital and admin user:", error);
    if (error.code === 11000)
      return res
        .status(409)
        .json({ message: "Email address is already in use" });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
