import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import upload from "../middleware/upload";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Get all users
router.get("/", authenticateToken, getUsers);

// Get user by ID
router.get("/:id", authenticateToken, getUserById);

// Create user
router.post(
  "/",
  authenticateToken,
  upload.single("profile_photo"),
  createUser,
);

// Update user
router.put(
  "/:id",
  authenticateToken,
  upload.single("profile_photo"),
  updateUser,
);

// Delete user
router.delete("/:id", authenticateToken, deleteUser);

export default router;