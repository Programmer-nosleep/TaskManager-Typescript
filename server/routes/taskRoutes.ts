import { Router, RequestHandler } from "express";
import { protect, adminOnly } from "../middleware/AuthMiddleware";

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
    protect: protect,
    handler: getDashboardData,
  },
  {
    method: "get",
    path: "/user-dahboard-data",
    protect: protect,
    handler: getUserDashboardData,
  },
  {
    method: "get",
    path: "/",
    protect: protect,
    handler: getTask,
  },
  {
    method: "get",
    path: "/:id",
    protect: protect,
    handler: getTaskById
  },
  {
    method: "post",
    path: "/",
    protect: protect,
    handler: createTask
  },
  {
    method: "put",
    path: "/:id",
    protect: protect,
    handler: updateTask
  },
  {
    method: "delete",
    path: "/:id",
    protect: protect,
    handler: deleteTask
  },
  {
    method: "put",
    path: "/:id/status",
    protect: protect,
    handler: updateTaskStatus
  },
  {
    method: "put",
    path: "/:id/todo",
    protect: protect,
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