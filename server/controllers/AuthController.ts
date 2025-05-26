import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import User from '../models/User'

// Type untuk generateToken
interface GenerateTokenPayload {
  id: string
}

// Helper: generate JWT token
const generateToken = ({ id }: GenerateTokenPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables")
  }

  return jwt.sign({ id }, secret, {
    expiresIn: "7d", // sesuaikan jika perlu
  })
}

// Register User
export const RegisterUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken({ id: newUser._id });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

// Login User
export const LoginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken({ id: user._id });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

// Profile (dummy handler untuk sekarang)
export const ProfileUser = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "Profile route hit" });
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {

}

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {

}