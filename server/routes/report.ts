import { RequestHandler, Router } from "express";
import { Protect, adminOnly } from "../middleware/AuthMiddleware";

import { exportTasksReport, exportUserReport } from "../controllers/reportController";

const router = Router();

interface Route {
  method: "post" | "get" | "put" | "delete";
  path: string;
  role?: RequestHandler;
  protect?: RequestHandler;
  handler: RequestHandler | RequestHandler[];
}

const ReportRoutes: Route[] = [
  {
    method: "get",
    path: "/export/tasks",
    role: adminOnly,
    protect: Protect,
    handler: exportTasksReport,
  },
  {
    method: "get",
    path: "/export/users",
    role: adminOnly,
    protect: Protect,
    handler: exportUserReport,
  }
];

ReportRoutes.forEach(({ method, path, protect, handler }) => {
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