import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];

      const secret = process.env.JWT_SECRET;

      if (!secret) {
        res.status(500).json({ message: "JWT_SECRET not set" });
        return;
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;

      if (!decoded || typeof decoded !== "object" || !decoded.id) {
        res.status(401).json({ message: "Invalid token" });
        return;
      }

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error: any) {
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};

export const adminOnly = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.user && req.user.role === "admin") {
    next()
  }
  res.status(403).json({ message: "access denied, admin only" })
}