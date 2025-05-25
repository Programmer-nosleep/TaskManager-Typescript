require("dotenv").config()

const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express();

// middleware to handle cors
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ["Content-Type", "Autorization"]
  })
)

// middleware
app.use(express.json());

// routes
const routes: [string, express.Router][] = [
  ["/api/auth", AuthRoutes],
  ["/api/users", userRoutes],
  ["/api/tasks", taskRoutes],
  ["/api/reports", reportRoutes]
];

routes.forEach(([path, handler]) => {
  app.use(path, handler);
});

// start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})