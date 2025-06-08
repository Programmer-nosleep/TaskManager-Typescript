import "dotenv/config";
import express, { Application } from "express";
import cors from "cors";
import connectDB from "./config/db";

import AuthRoutes from "./routes/AuthRoutes";
import UserRoutes from "./routes/userRoutes";
import TaskRoutes from "./routes/taskRoutes";
import ReportRoutes from "./routes/report";

const app: Application = express();

// Middleware CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware JSON parser
app.use(express.static("../dist"));
app.get("*", (req, res) => {
  res.sendFile("../dist/index.html");
});

// Connect database
connectDB();

// Routes array with path and router handler
const routes: [string, express.Router][] = [
  ["/api/auth", AuthRoutes],
  ["/api/users", UserRoutes],
  ["/api/tasks", TaskRoutes],
  ["/api/reports", ReportRoutes],
];

// Register routes
routes.forEach(([path, handler]) => {
  app.use(path, handler);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
