import { Router } from "express";
import upload from "../middleware/upload";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = Router();

router.get("/", getUsers);

router.get("/:id", getUserById);

router.post(
  "/",
  upload.single("profile_photo"),
  createUser,
);

router.put(
  "/:id",
  upload.single("profile_photo"),
  updateUser,
);

router.delete("/:id", deleteUser);

export default router;