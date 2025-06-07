import { Router, RequestHandler } from "express";
import { Protect, adminOnly } from "../middleware/AuthMiddleware";

import { getDashboardData, getUserDashboardData, getTask, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } from "../controllers/taskController";

const router = Router();

interface Route {
  method: "post" | "get" | "put" | "delete";
  path: string;
  role?: RequestHandler;
  protect?: RequestHandler;
  handler: RequestHandler | RequestHandler[];
}

const TaskRoutes: Route[] = [
  {
    method: "get",
    path: "/dashboard-data",
    protect: Protect,
    handler: getDashboardData,
  },
  {
    method: "get",
    path: "/user-dashboard-data",
    protect: Protect,
    handler: getUserDashboardData,
  },
  {
    method: "get",
    path: "/",
    protect: Protect,
    handler: getTask,
  },
  {
    method: "get",
    path: "/:id",
    protect: Protect,
    handler: getTaskById
  },
  {
    method: "post",
    path: "/",
    protect: Protect,
    handler: createTask
  },
  {
    method: "put",
    path: "/:id",
    protect: Protect,
    handler: updateTask
  },
  {
    method: "delete",
    path: "/:id",
    protect: Protect,
    handler: deleteTask
  },
  {
    method: "put",
    path: "/:id/status",
    protect: Protect,
    handler: updateTaskStatus
  },
  {
    method: "put",
    path: "/:id/todo",
    protect: Protect,
    handler: updateTaskChecklist
  }
];

TaskRoutes.forEach(({ method, path, protect, handler }) => {
  const handlers: RequestHandler[] = [];

  if (protect) handlers.push(protect);
  // if (role) handlers.push(role);
  if (Array.isArray(handler)) {
    handlers.push(...handler);
  } else {
    handlers.push(handler);
  }

  router[method](path, ...handlers);
});

export default router;