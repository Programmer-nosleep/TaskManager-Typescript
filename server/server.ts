require("dotenv").config()

const express = require("express")
const cors = require("cors")
const path = require("path")
const connect = require("./config/db")

const app = express();

// middleware to handle cors
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ["Content-Type", "Autorization"]
  })
)

// connect database
connectDB()

// middleware
app.use(express.json())

// routes
const routeMap: Record<string, express.Router> = {
  "/api/auth": AuthRoutes,
  "/api/users": userRoutes,
  "/api/tasks": taskRoutes,
  "/api/reports": reportRoutes
};

Object.entries(routeMap).forEach(([path, router]) => {
  app.use(path, router);
});

// start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})