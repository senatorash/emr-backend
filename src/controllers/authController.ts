import { CookieOptions, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel";
import { generateToken, verifyToken } from "../helpers/jwtHelpers";
import envVariables from "../config/index";

const { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, JWT_SECRET } =
  envVariables;

export const loginAdmins = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // verify if user with email exist in the database
    const userExists = await User.findOne({
      email,
      role: { $in: ["super_admin", "nurse", "doctor"] },
    });
    if (!userExists) {
      return res.status(404).json({ message: "Super admin not found" });
    }

    // compare the password with the hashed password stored in the database
    const passwordMatch = bcrypt.compareSync(password, userExists.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Login Credentials" });
    }

    //
    const superAdminPayload = {
      _id: userExists._id.toString(),
      role: userExists.role,
      fullName: userExists.fullName,
      email: userExists.email,
    };

    // generate access token and refresh token
    const accessToken = generateToken(
      superAdminPayload,
      `${ACCESS_TOKEN_EXPIRES_IN}h`,
      JWT_SECRET
    );

    const refreshToken = generateToken(
      superAdminPayload,
      `${REFRESH_TOKEN_EXPIRES_IN}h`,
      JWT_SECRET
    );

    const cookieOptions: CookieOptions = {
      expires: new Date(Date.now() + 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    };
    return res.cookie("accessToken", accessToken, cookieOptions).json({
      message: `Successfully logged in from ${userExists.role}-${userExists.fullName} account`,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    return res
      .clearCookie("accessToken")
      .json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
