import { Router, RequestHandler } from "express";
import { LoginUser, RegisterUser, updateUserProfile, getUserProfile } from "../controllers/AuthController";
import { protect } from "../middleware/AuthMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

interface RouteConfig {
  method: "get" | "post" | "put" | "delete";
  path: string;
  protect?: RequestHandler;
  handler: RequestHandler | RequestHandler[];
}

// Combine middleware and handler into one array if needed
const combineHandler = (
  middlewares: RequestHandler[] = [],
  handler: RequestHandler
): RequestHandler[] => [...middlewares, handler];

// All routes
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
  {
    method: "post",
    path: "/upload-image",
    handler: combineHandler([
      upload.single("image")
    ], (req, res): void => {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }
      const imgUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      res.status(200).json({ imgUrl });
    }),    
  }
];

// Register routes
routes.forEach(({ method, path, protect, handler }) => {
  if (Array.isArray(handler)) {
    if (protect) {
      router[method](path, protect, ...handler);
    } else {
      router[method](path, ...handler);
    }
  } else {
    if (protect) {
      router[method](path, protect, handler);
    } else {
      router[method](path, handler);
    }
  }
});

export default router;

