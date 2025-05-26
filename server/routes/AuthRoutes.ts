import { Router, RequestHandler } from "express";
import { LoginUser, RegisterUser, ProfileUser, updateUserProfile, getUserProfile } from "../controllers/AuthController";
import { protect } from "../middleware/AuthMiddleware"

const router = Router();

interface RouteConfig {
  method: "get" | "post" | "put" | "delete";
  path: string;
  protect?: RequestHandler;
  handler: RequestHandler;
}

const routes: RouteConfig[] = [
  {
    method: "post",
    path: "/login",
    handler: LoginUser,
  },
  {
    method: "post",
    path: "/register",
    handler: RegisterUser,
  },
  {
    method: "post",
    path: "/profile",
    handler: ProfileUser,
  },
  {
    method: "put",
    path: "/profile",
    protect: protect,
    handler: updateUserProfile,
  },
  {
    method: "get",
    path: "/profile",
    protect: protect,
    handler: getUserProfile,
  },
];

// Daftarkan semua route ke router, dengan middleware protect jika ada
routes.forEach(({ method, path, protect, handler }) => {
  if (protect) {
    router[method](path, protect, handler);
  } else {
    router[method](path, handler);
  }
});

export default router;
