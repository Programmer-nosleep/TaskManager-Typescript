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
   const user = await.find({ role: 'member' }).select("-password");
    
  } catch (err: any) {
   res.status(500).json({ message: "server error", error: err.message }) 
  }  
};

/*
  @desc Get user by id
  @route GET /api/users/
  @access Private (Admin)
*/
const getUserById =async (req: Request, res: Response): Promise<void> => {
  try {
    
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

export const user = {
  getUsers,
  getUserById,
  deleteUser
};