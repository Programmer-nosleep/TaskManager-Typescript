import { Request, Response } from "express";

import TaskModel from "../models/Task";
import User from "../models/User";

import bcrypt from "bcryptjs";

/*
  @desc Get all users (Admin Only)
  @route GET /api/users/
  @access Private (Admin)
*/
const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.find({ role: 'member' }).select("-password");

    const usersWithCounts = await Promise.all(user.map(async (user): Promise<any> => {
      const pendingTasks = await TaskModel.countDocuments({ assignedTo: user.id, status: "pending" });
      const inProgressTasks = await TaskModel.countDocuments({ assignedTo: user.id, status: "in progress" });
      const completedTasks = await TaskModel.countDocuments({ assignedTo: user.id, status: "completed" });

      return {
        ...user._doc,
        pendingTasks,
        inProgressTasks,
        completedTasks
      };
    }));

    res.json(usersWithCounts);
  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

/*
  @desc Get user by id
  @route GET /api/users/
  @access Private (Admin)
*/
const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};


/*
  @desc Delete users (Admin Only)
  @route DELETE /api/users
  @access Private (Admin)
*/
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    
  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

export { getUsers, getUserById, deleteUser };
