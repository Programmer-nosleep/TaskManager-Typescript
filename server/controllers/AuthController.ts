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

/*
  @desc   Register user
  @route  POST /api/auth/profile
  @access Private (Require JWT)
*/
export const RegisterUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, profileImgUrl, adminInviteToken } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    let role: string = "member"
    if (adminInviteToken == process.env.ADMIN_INVITE_TOKEN) {
      role = "admin"
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImgUrl,
      role
    })

    const token = generateToken({ id: newUser.id });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileImageUrl: newUser.profileImgUrl,
        token: generateToken(newUser.id)
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}

/*
  @desc   Login user profile
  @route  POST /api/auth/profile
  @access Public
*/
export const LoginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({message: "invalid email or password"});
    }

    const token = generateToken({ id: user.id });

    // return user data with jwt??
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
}

// Profile (dummy handler untuk sekarang)
// export const ProfileUser = async (req: Request, res: Response): Promise<void> => {
//   res.status(200).json({ message: "Profile route hit" });
// };

/*
  @desc   Get user profile
  @route  GET /api/auth/profile
  @access Private (Require JWT)
*/
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
   const user = await User.findById(req.user.id).select("-password");
   if (!user) {
    res.status(404).json({message: "user not found"});
   } 
   res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
}

/*
  @desc   Update user profile
  @route  PUT /api/auth/profile
  @access Private (Require JWT)
*/

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({message: "user not found"});
      return;
    }

    user.name = req.body.name || user?.name;
    user.email = req.body.email || user?.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updateUser = await user?.save();

    res.status(200).json({
      message: "Login successful",
      user: {
        id: updateUser.id,
        name: updateUser.name,
        email: updateUser.email,
        role: updateUser.role,
        token: generateToken(updateUser.id)
      },
    }); 

  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message })
  }
}