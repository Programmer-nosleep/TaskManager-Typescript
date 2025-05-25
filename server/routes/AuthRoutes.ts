import { Router, Request, Response } from "express";

const router = Router();

router.post("/login", (req: Request, res: Response) => {
  // Dummy login response
  res.json({ message: "Login route hit" });
});

export default router;
