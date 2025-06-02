import { RequestHandler, Request, Response } from "express";
import User from "../models/User"; 
import Task from "../models/Task";

import excelJS from "exceljs";

/*
  @desc Export all tasks as an excel file
  @route GET /api/reports/export/tasks
  @access Private (Admin)
*/

export const exportTasksReport: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Task Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 }
    ];

    tasks.forEach((task) => {
      const assignedUser = (task.assignedTo && typeof task.assignedTo === 'object')
        ? `${(task.assignedTo as any).name} (${(task.assignedTo as any).email})`
        : "Unassigned";

      worksheet.addRow({
        _id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "N/A",
        assignedTo: assignedUser
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="task_report.xlsx"');

    await workbook.xlsx.write(res);
    res.end();

  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};


/*
  @desc Export user-task report as an Excel file
  @route GET /api/reports/export/users
  @access Private (Admin)
*/

export const exportUserReport: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    const tasks = await Task.find().select("assignedTo");

    // Hitung jumlah tugas per user
    const taskCountMap: Record<string, number> = {};
    tasks.forEach((task) => {
      const userId = task.assignedTo?.toString();
      if (userId) {
        taskCountMap[userId] = (taskCountMap[userId] || 0) + 1;
      }
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Report");

    worksheet.columns = [
      { header: "User ID", key: "_id", width: 25 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Assigned Task Count", key: "taskCount", width: 20 }
    ];

    users.forEach((user) => {
      worksheet.addRow({
        _id: user.id,
        name: user.name,
        email: user.email,
        taskCount: taskCountMap[user.id.toString()] || 0
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="user_report.xlsx"');

    await workbook.xlsx.write(res);
    res.end();

  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

