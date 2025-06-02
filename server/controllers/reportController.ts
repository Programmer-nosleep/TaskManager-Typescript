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
    const users = await User.find().select("name email _id").lean();
    const tasks = await Task.find().populate("assignedTo", "name email _id").lean();

    const userTaskMap: Record<string, {
      taskCount: number;
      pendingTasks: number;
      inProgressTasks: number;
      completedTasks: number;
    }> = {};

    users.forEach((user) => {
      userTaskMap[user._id.toString()] = {
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    tasks.forEach((task) => {
      const assignedUser = task.assignedTo;
      if (assignedUser && typeof assignedUser === "object" && "_id" in assignedUser) {
        const userId = (assignedUser as any)._id.toString();

        if (!userTaskMap[userId]) {
          userTaskMap[userId] = {
            taskCount: 0,
            pendingTasks: 0,
            inProgressTasks: 0,
            completedTasks: 0,
          };
        }

        userTaskMap[userId].taskCount += 1;

        switch (task.status) {
          case "Pending":
            userTaskMap[userId].pendingTasks += 1;
            break;
          case "In Progress":
            userTaskMap[userId].inProgressTasks += 1;
            break;
          case "Completed":
            userTaskMap[userId].completedTasks += 1;
            break;
        }
      }
    });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Task Report");

    worksheet.columns = [
      { header: "User ID", key: "_id", width: 30 },
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Assigned Task Count", key: "taskCount", width: 20 },
      { header: "Pending Tasks", key: "pendingTasks", width: 20 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 25 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 }
    ];

    users.forEach((user) => {
      const stats = userTaskMap[user._id.toString()] || {
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };

      worksheet.addRow({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        taskCount: stats.taskCount,
        pendingTasks: stats.pendingTasks,
        inProgressTasks: stats.inProgressTasks,
        completedTasks: stats.completedTasks
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
