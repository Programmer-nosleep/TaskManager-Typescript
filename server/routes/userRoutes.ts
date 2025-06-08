import { RequestHandler, Router } from "express";
import { Protect, adminOnly } from "../middleware/AuthMiddleware";
import { getUsers, getUserById, deleteUser } from "../controllers/userController";

const router = Router();

interface Route {
  method: "post" | "get" | "put" | "delete";
  path: string;
  role?: RequestHandler;
  protect?: RequestHandler;
  handler: RequestHandler | RequestHandler[];
}

const UserRoutes: Route[] = [
  {
    method: "get",
    path: "/login",
    role: adminOnly,
    protect: Protect,
    handler: getUsers,
  },
  {
    method: "get",
    path: "/:id",
    protect: Protect,
    handler: getUserById,
  },
  {
    method: "delete",
    path: "/:id",
    role: adminOnly,
    protect: Protect,
    handler: deleteUser,
  },
];

// Register each route
UserRoutes.forEach(({ method, path, protect, role, handler }) => {
  const handlers: RequestHandler[] = [];

  if (protect) handlers.push(protect);
  if (role) handlers.push(role);
  if (Array.isArray(handler)) {
    handlers.push(...handler);
  } else {
    handlers.push(handler);
  }

  router[method](path, ...handlers);
});

export default router; 
