import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import userRoutes from "./routes/userRoutes";
import loginRoutes from "./routes/loginRoutes";
import logger from "./middleware/logger";
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;

// Built-in middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads")),
);

// Custom middleware
app.use(logger);

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Login routes
app.use("/api/login", loginRoutes);

// User routes
app.use("/api/users", userRoutes);


// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});