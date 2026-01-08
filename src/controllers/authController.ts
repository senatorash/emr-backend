import { CookieOptions, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel";
import Session from "../models/sessionModel";
import { generateToken, verifyToken } from "../helpers/jwtHelpers";
import envVariables from "../config/index";
import { userPayload } from "../interfaces/userPayload";

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

    // create user payload for token generation
    const adminPayload = {
      userId: userExists._id.toString(),
      role: userExists.role,
      fullName: userExists.fullName,
      email: userExists.email,
    };

    // store the refresh token in the database with user agent and ip address
    const session = await Session.create({
      user: userExists._id,
      deviceInfo: req.headers["user-agent"],
      ipAddress: req.ip,
      expiresAt: new Date(
        Date.now() + Number(REFRESH_TOKEN_EXPIRES_IN) * 60 * 60 * 1000
      ),
    });

    // generate access token and refresh token
    const accessToken = generateToken(
      adminPayload,
      `${ACCESS_TOKEN_EXPIRES_IN}m`,
      JWT_SECRET
    );

    const refreshToken = generateToken(
      { ...adminPayload, sessionId: session._id.toString() },
      `${REFRESH_TOKEN_EXPIRES_IN}h`,
      JWT_SECRET
    );

    // hash the refresh token before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    session.token = hashedRefreshToken;
    await session.save();

    const cookieOptions: CookieOptions = {
      expires: new Date(
        Date.now() + Number(REFRESH_TOKEN_EXPIRES_IN) * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    };

    return res.cookie("r_t", refreshToken, cookieOptions).json({
      message: `Successfully logged in from ${userExists.role}-${userExists.fullName} account`,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.r_t;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not provided" });
    }
    const payload = verifyToken<userPayload>(refreshToken, JWT_SECRET);
    if (!payload) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const session = await Session.findById(payload.sessionId);

    if (!session) {
      return res.status(403).json({
        message: "Session not found for the provided refresh token",
      });
    }
    // check if the provided refresh token matches any stored session
    // let validSession = null;
    // for (const session of sessions) {
    //   const isMatch = await bcrypt.compare(refreshToken, session.token);
    //   if (isMatch) {
    //     validSession = session;
    //     break;
    //   }
    // }
    // // If no matching session is found, return an error
    // if (!validSession) {
    //   return res.status(403).json({
    //     message: "Refresh token does not match any active session",
    //   });
    // }

    const adminPayload = {
      userId: payload.userId.toString(),
      role: payload.role,
      fullName: payload.fullName,
      email: payload.email,
    };

    // rotate tokens
    const newAccessToken = generateToken(
      adminPayload,
      `${ACCESS_TOKEN_EXPIRES_IN}m`,
      JWT_SECRET
    );

    const newRefreshToken = generateToken(
      adminPayload,
      `${REFRESH_TOKEN_EXPIRES_IN}h`,
      JWT_SECRET
    );

    // hash the new refresh token before storing it in the database
    const salt = await bcrypt.genSalt(10);
    session.token = await bcrypt.hash(newRefreshToken, salt);

    await session.save();

    const cookieOptions: CookieOptions = {
      expires: new Date(
        Date.now() + Number(REFRESH_TOKEN_EXPIRES_IN) * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    };
    return res.cookie("r_t", newRefreshToken, cookieOptions).json({
      message: "Tokens refreshed Successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    // delete the session from the database
    const refreshToken = req.cookies.r_t;
    //
    const payload = verifyToken<userPayload>(refreshToken, JWT_SECRET);
    if (!payload?.sessionId) {
      return res.status(403).json({ message: "Invalid refresh token" });
    } else {
      await Session.findByIdAndDelete(payload.sessionId);
    }

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    };
    return res
      .clearCookie("r_t", cookieOptions)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get current login user details
export const getCurrentAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user as userPayload;
    const user = await User.findById(userId).select(
      "-password -createdAt -updatedAt -__v"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userExists = {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    return res
      .status(200)
      .json({ message: "User fetched successfully", user: userExists });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
