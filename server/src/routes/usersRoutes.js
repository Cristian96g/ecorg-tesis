import { Router } from "express";
import {
  me,
  updateMe,
  setRole,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";
import { verifyJWT, requireRole } from "../middleware/auth.js";
import { uploadAvatar } from "../middleware/upload.js";

const router = Router();

/** Self */
router.get("/me", verifyJWT, me);
router.put("/me", verifyJWT, uploadAvatar.single("avatar"), updateMe);

/** Admin CRUD */
router.get("/", verifyJWT, requireRole("admin"), getUsers);
router.post("/", verifyJWT, requireRole("admin"), createUser);
router.get("/:id", verifyJWT, requireRole("admin"), getUserById);
router.put("/:id", verifyJWT, requireRole("admin"), updateUser);
router.delete("/:id", verifyJWT, requireRole("admin"), deleteUser);
router.put("/:id/role", verifyJWT, requireRole("admin"), setRole);

export default router;
