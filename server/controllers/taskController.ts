import { Request, Response, RequestHandler } from "express";
import Task from "../models/Task";
import { takeCoverage } from "v8";
import { AsyncLocalStorage } from "async_hooks";

/*
  @desc Get Dashboard Data (Admin Only)
  @route GET /api/dashboard-data
  @access Private
*/
export const getDashboardData: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const statusList = ["Pending", "In Progress", "Completed"];
    const priorityList = ["Low", "Medium", "High"];

    const totalTasks = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: "Pending" });
    const inProgress = await Task.countDocuments({ status: "In Progress" });
    const completed = await Task.countDocuments({ status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() }
    });

    const taskDistributionRaw = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const taskDistribution = statusList.reduce((acc: Record<string, number>, status) => {
      const found = taskDistributionRaw.find(item => item._id === status);
      acc[status] = found ? found.count : 0;
      return acc;
    }, {} as Record<string, number>);

    taskDistribution["All"] = totalTasks;

    const taskPriorityRaw = await Task.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    const taskPriorities = priorityList.reduce((acc: Record<string, number>, priority) => {
      const found = taskPriorityRaw.find(item => item._id === priority);
      acc[priority] = found ? found.count : 0;
      return acc;
    }, {} as Record<string, number>);

    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pending,
        inProgress,
        completed,
        overdueTasks
      },
      charts: {
        taskDistribution,
        taskPriorities
      },
      recentTasks
    });
  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

/*
  @desc Get from all task (admin : all, user: only assigned tasks)
  @route GET /api/tasks/
  @access Private
*/
export const getTask: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    let filter: any = {};
    let tasks;

    if (status) filter.status = status;

    tasks = req.user.role === "admin"
      ? await Task.find(filter).populate("assignedTo", "name email profileImgUrl")
      : await Task.find({ ...filter, assignedTo: req.user.id }).populate("assignedTo", "name email profileImgUrl");

    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist?.filter(item => item.completed).length || 0;
        return { ...task.toObject(), completedTodoCount: completedCount };
      })
    );

    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user.id }
    );

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user.id })
    });

    const inProgressTask = await Task.countDocuments({
      ...filter,
      status: "in progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user.id })
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user.id })
    });

    res.status(200).json({
      tasks,
      stats: {
        allTasks,
        pendingTasks,
        inProgressTask,
        completedTasks
      }
    });
  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

/*
  @desc Get from task by ID
  @route GET /api/tasks/:id
  @access Private
*/
export const getTaskById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "name email profileImgUrl");
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.status(200).json(task);
  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

/*
  @desc Get User Dashboard Data (User-specific)
  @route GET /api/tasks/user-dashboard-data
  @access Private
*/
export const getUserDashboardData: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;

    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
    const inProgressTask = await Task.countDocuments({ assignedTo: userId, status: "In Progress" });
    const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() }
    });

    // Status Distribution
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const taskDistribution = taskStatuses.reduce((acc: Record<string, number>, status: string) => {
      const formattedKey = status.replace(/\s+/g, "");
      acc[formattedKey] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["All"] = totalTasks;

    // Priority Distribution
    const taskPriorities = ["Low", "Medium", "High"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc: Record<string, number>, priority: string) => {
      acc[priority] = taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
      return acc;
    }, {});

    // Recent Tasks
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        inProgressTask,
        completedTasks,
        overdueTasks
      },
      charts: {
        taskDistribution,
        taskPriorityLevels
      },
      recentTasks
    });
  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

/*
  @desc Create a new task (Admin Only)
  @route POST /api/tasks/:id
  @access Private (Admin)
*/
export const createTask: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, desc, priority, dueDate, assignedTo, attachements, todoChecklist } = req.body;

    if (!Array.isArray(assignedTo)) {
      res.status(400).json({ message: "assignedTo must be an array of user IDs" });
      return;
    }

    const task = await Task.create({
      title, desc, priority, dueDate, assignedTo, attachements, todoChecklist
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

/*
  @desc Update task details
  @route PUT /api/tasks/:id
  @access Private
*/
export const updateTask: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;
    task.assignedTo = req.body.assignedTo || task.assignedTo;

    if (req.body.assignedTo && !Array.isArray(req.body.assignedTo)) {
      res.status(400).json({ message: "assignedTo must be an array of user IDs" });
      return;
    }

    const updatedTask = await task.save();
    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

/*
  @desc Delete a task (Admin Only)
  @route DELETE /api/tasks/:id
  @access Private
*/
export const deleteTask: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

/*
  @desc Update task status
  @route PUT /api/tasks/:id/status
  @access Private
*/
export const updateTaskStatus: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id).populate("assignedTo", "name email profileImgUrl");

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Pastikan user yang mengubah adalah yang ditugaskan atau admin
    const isAssigned = Array.isArray(task.assignedTo as any[]) 
      ? task.assignedTo.some(user => user._id.toString() === req.user.id.toString())
      : task.assignedTo.toString() === req.user.id.toString();

    if (!isAssigned && req.user.role !== "admin") {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    // Update status
    task.status = status || task.status;

    if (task.status === "Completed" && task.todoChecklist) {
      task.todoChecklist.forEach(item => item.completed = true);
      task.progress = 100;
    }

    const updatedTask = await task.save();

    res.status(200).json({ message: "Status updated successfully", task: updatedTask });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


/*
  @desc Update task checklist
  @route PUT /api/tasks/:id/todo
  @access Private
*/
export const updateTaskChecklist: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    if (!task.assignedTo.includes(req.user.id) && req.user.role !== "admin") {
      res.status(403).json({ message: "Not authorized to update checklist" });
      return;
    }

    task.todoChecklist = todoChecklist;

    const completedCount = todoChecklist?.filter((items: {completed: Boolean}) => items.completed).length || 0;
    const totalItems = todoChecklist?.length || 0;

    task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
    task.status = task.progress === 100 ? "Completed" : task.progress > 0 ? "In Progress" : "Pending";

    const updatedTask = await task.save();
    res.status(200).json({ message: "Checklist updated successfully", task: updatedTask });
  } catch (err: any) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};
